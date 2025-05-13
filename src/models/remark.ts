import mongoose, { Schema, Document, Types } from 'mongoose';


type DeletedByModel = 'dispatcher' | 'admin' | 'user' | 'superadmin';

interface RemarkDocument extends Document {
  comment?: string;
  isDeleted: Date | null;
  
  createdAt: Date;
  updatedAt: Date;
}

const remarkSchema = new Schema<RemarkDocument>({
  comment: {
    type: String,
    trim: true
  },
  isDeleted: {
    type: Date,
    default: null
  },
  // Uncomment and implement these when needed:
  // createdBy: {
  //   type: Schema.Types.ObjectId,
  //   refPath: "deletedByModel"
  // },
  // deletedBy: {
  //   type: Schema.Types.ObjectId,
  //   refPath: "deletedByModel"
  // },
  // deleteByModel: {
  //   type: String,
  //   enum: ['dispatcher', 'admin', 'user', 'superadmin'] as const
  // },
  // reason: {
  //   type: String,
  //   enum: ['product_tobereturned', 'cancel_order_by_admin', 
  //          'cancel_order_by_user', 'disapprove_product'] as const
  // }
}, { timestamps: true });

const Remark = mongoose.model<RemarkDocument>('remark', remarkSchema);
export default Remark;