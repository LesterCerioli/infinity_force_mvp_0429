import { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';
import { v4 as uuidv4 } from 'uuid';
import * as paytm from 'paytmchecksum';
import asyncErrorHandler from '@/middlewares/helpers/asyncErrorHandler';
import Payment from '@/lib/models/paymentModel';
import ErrorHandler from '@/lib/utils/errorHandler';

interface ExtendedRequest extends NextApiRequest {
  body: {
    amount: number;
    email: string;
    phoneNo: string;
    [key: string]: any;
  };
}


export const processPayment = asyncErrorHandler(
  async (req: ExtendedRequest, res: NextApiResponse) => {
    const { amount, email, phoneNo } = req.body;

    const params: Record<string, string> = {
      MID: process.env.PAYTM_MID!,
      WEBSITE: process.env.PAYTM_WEBSITE!,
      CHANNEL_ID: process.env.PAYTM_CHANNEL_ID!,
      INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE!,
      ORDER_ID: 'oid' + uuidv4(),
      CUST_ID: process.env.PAYTM_CUST_ID!,
      TXN_AMOUNT: amount.toString(),
      CALLBACK_URL: `https://${req.headers.host}/api/v1/callback`,
      EMAIL: email,
      MOBILE_NO: phoneNo,
    };

    try {
      const checksum = await paytm.generateSignature(params, process.env.PAYTM_MERCHANT_KEY!);
      const paytmParams = {
        ...params,
        CHECKSUMHASH: checksum,
      };

      res.status(200).json({ paytmParams });
    } catch (error) {
      console.error(error);
      throw new ErrorHandler('Payment generation failed', 500);
    }
  }
);


export const paytmResponse = (req: ExtendedRequest, res: NextApiResponse) => {
  const paytmChecksum = req.body.CHECKSUMHASH;
  delete req.body.CHECKSUMHASH;

  const isValid = paytm.verifySignature(
    req.body,
    process.env.PAYTM_MERCHANT_KEY!,
    paytmChecksum
  );

  if (!isValid) {
    console.log('Checksum Mismatched');
    return;
  }

  const paytmParams = {
    body: {
      mid: req.body.MID,
      orderId: req.body.ORDERID,
    },
  };

  paytm
    .generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MERCHANT_KEY!)
    .then((checksum) => {
      paytmParams['head'] = {
        signature: checksum,
      };

      const post_data = JSON.stringify(paytmParams);

      const options = {
        hostname: 'securegw-stage.paytm.in', // Change to securegw.paytm.in for production
        port: 443,
        path: '/v3/order/status',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(post_data),
        },
      };

      const post_req = https.request(options, (post_res) => {
        let response = '';

        post_res.on('data', (chunk) => {
          response += chunk;
        });

        post_res.on('end', () => {
          const { body } = JSON.parse(response);
          addPayment(body);
          res.redirect(`https://${req.headers.host}/order/${body.orderId}`);
        });
      });

      post_req.write(post_data);
      post_req.end();
    });
};

const addPayment = async (data: any) => {
  try {
    await Payment.create(data);
  } catch (error) {
    console.error('Payment Failed!', error);
  }
};


export const getPaymentStatus = asyncErrorHandler(
  async (req: ExtendedRequest, res: NextApiResponse) => {
    const payment = await Payment.findOne({ orderId: req.query.id });

    if (!payment) {
      throw new ErrorHandler('Payment Details Not Found', 404);
    }

    const txn = {
      id: payment.txnId,
      status: payment.resultInfo.resultStatus,
    };

    res.status(200).json({
      success: true,
      txn,
    });
  }
);
