import mongoose, { Schema, Document, Types } from 'mongoose';

interface ProductImageDocument extends Document {
  thumbnail?: string;
  medium?: string;
  large?: string;
  productLink?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const productImageSchema = new Schema<ProductImageDocument>({
  thumbnail: {
    type: String,
    trim: true
  },
  medium: {
    type: String,
    trim: true
  },
  large: {
    type: String,
    trim: true
  },
  productLink: {
    type: Schema.Types.ObjectId,
    ref: "product",
    default: null
  }
}, { timestamps: true });

const ProductImage = mongoose.model<ProductImageDocument>('productimages', productImageSchema);
export default ProductImage;