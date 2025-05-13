import mongoose, { Schema, Document } from 'mongoose';

interface IResultInfo {
  resultStatus: string;
  resultCode: string;
  resultMsg: string;
}

export interface IPayment extends Document {
  resultInfo: IResultInfo;
  txnId: string;
  bankTxnId: string;
  orderId: string;
  txnAmount: string;
  txnType: string;
  gatewayName: string;
  bankName: string;
  mid: string;
  paymentMode: string;
  refundAmt: string;
  txnDate: string;
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  resultInfo: {
    resultStatus: { type: String, required: true },
    resultCode: { type: String, required: true },
    resultMsg: { type: String, required: true },
  },
  txnId: { type: String, required: true },
  bankTxnId: { type: String, required: true },
  orderId: { type: String, required: true },
  txnAmount: { type: String, required: true },
  txnType: { type: String, required: true },
  gatewayName: { type: String, required: true },
  bankName: { type: String, required: true },
  mid: { type: String, required: true },
  paymentMode: { type: String, required: true },
  refundAmt: { type: String, required: true },
  txnDate: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;
