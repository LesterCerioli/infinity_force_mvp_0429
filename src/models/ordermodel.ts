import mongoose, { Schema, Document } from 'mongoose';

interface IShippingInfo {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: number;
  phoneNo: number;
}

interface IOrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  product: mongoose.Types.ObjectId;
}

interface IPaymentInfo {
  id: string;
  status: string;
}

export interface IOrder extends Document {
  shippingInfo: IShippingInfo;
  orderItems: IOrderItem[];
  user: mongoose.Types.ObjectId;
  paymentInfo: IPaymentInfo;
  paidAt: Date;
  totalPrice: number;
  orderStatus: string;
  deliveredAt?: Date;
  shippedAt?: Date;
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
  shippingInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: Number, required: true },
    phoneNo: { type: Number, required: true },
  },
  orderItems: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  paymentInfo: {
    id: { type: String, required: true },
    status: { type: String, required: true },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: 'Processing',
  },
  deliveredAt: Date,
  shippedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
