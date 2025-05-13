import mongoose, { Schema, Document, Model, Types } from 'mongoose';


interface ICart extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
  productAttributes?: string;
  isDeleted: Date | null;
  createdAt: Date;
  updatedAt: Date;
}


const cartSchema = new Schema<ICart>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    index: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product reference is required'],
    index: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  productAttributes: {
    type: String,
    trim: true
  },
  isDeleted: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;  
      return ret;
    }
  }
});


cartSchema.index({ user: 1, product: 1 }, { unique: true }); // One product per user
cartSchema.index({ isDeleted: 1 }); 


cartSchema.virtual('itemTotal').get(function(this: ICart) {
  
  return this.quantity * (this as any).product?.price || 0;
});


const Cart: Model<ICart> = mongoose.model<ICart>('Cart', cartSchema);

export default Cart;