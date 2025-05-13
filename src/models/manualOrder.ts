import { Document, Schema, model } from 'mongoose';

interface IManualOrder extends Document {
  productName?: string;
  link?: string;
  description?: string;
  isDeleted?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const manualOrderSchema: Schema = new Schema({
  productName: {
    type: String,
  },
  link: {
    type: String,
  },
  description: {
    type: String,
  },
  isDeleted: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

const ManualOrder = model<IManualOrder>('manualorder', manualOrderSchema);
export default ManualOrder;