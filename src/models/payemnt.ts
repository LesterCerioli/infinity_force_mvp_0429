import mongoose, { Schema, Document, Types } from 'mongoose';


type PaymentMethod = 'Cash on Delivery' | 'manual';

interface PaymentDocument extends Document {
  user: Types.ObjectId;
  order: Types.ObjectId;
  method?: PaymentMethod;
  shippingCharge?: number;
  amount?: number;
  returnedAmount: number | null;
  transactionCode: string;
  from?: number;
  isDeleted: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<PaymentDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "order",
    required: true
  },
  method: {
    type: String,
    enum: ['Cash on Delivery', 'manual'] as const, // manual ==> bank or manual esewa
  },
  shippingCharge: {
    type: Number,
  },
  amount: {
    type: Number,
  },
  returnedAmount: {
    type: Number,
    default: null
  },
  transactionCode: {
    type: String,
    required: true
  },
  from: {
    type: Number,
    max: 9999999999 // !esewa && receiverNumber
  },
  isDeleted: {
    type: Date,
    default: null
  }
}, { timestamps: true });

const Payment = mongoose.model<PaymentDocument>("payment", paymentSchema);
export default Payment;