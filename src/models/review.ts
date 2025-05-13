import mongoose, { Schema, Document, Types } from 'mongoose';

interface ReviewDocument extends Document {
  user?: Types.ObjectId;
  product?: Types.ObjectId;
  comment?: string;
  star?: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<ReviewDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'User reference is required']
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: [true, 'Product reference is required']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  star: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    required: [true, 'Star rating is required']
  }
}, { timestamps: true });

const Review = mongoose.model<ReviewDocument>('reviews', reviewSchema);
export default Review;