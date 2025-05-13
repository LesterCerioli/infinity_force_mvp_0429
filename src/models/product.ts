import mongoose, { Schema, Document, Types } from 'mongoose';
import URLSlugs from 'mongoose-url-slugs';
import { districts } from '../middleware/common';

export interface IProduct extends Document {
  name: string;
  brand?: Types.ObjectId;
  quantity: number;
  category: Types.ObjectId[];
  averageRating?: mongoose.Types.Decimal128;
  totalRatingUsers?: number;
  soldBy?: Types.ObjectId;
  images?: Types.ObjectId[];
  warranty: string;
  return: string;
  size?: string[];
  model?: string;
  color?: string[];
  weight?: string[];
  description: string;
  highlights: string;
  tags?: string[];
  price: mongoose.Types.Decimal128;
  discountRate?: number;
  videoURL?: string[];
  isVerified?: Date | null;
  isRejected?: Date | null;
  isDeleted?: Date | null;
  isFeatured?: Date | null;
  viewsCount?: number;
  trendingScore?: mongoose.Types.Decimal128;
  noOfSoldOut?: number;
  slug?: string;
  availableDistricts: string[];
  remark?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 128,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'productbrand',
    },
    quantity: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
    },
    category: [
      {
        type: Schema.Types.ObjectId,
        ref: 'category',
      },
    ],
    averageRating: {
      type: Schema.Types.Decimal128,
    },
    totalRatingUsers: {
      type: Number,
    },
    soldBy: {
      type: Schema.Types.ObjectId,
      ref: 'admin',
    },
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: 'productimages',
      },
    ],
    warranty: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    return: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    size: [
      {
        type: String,
        trim: true,
        maxlength: 32,
      },
    ],
    model: {
      type: String,
      trim: true,
      maxlength: 128,
    },
    color: [
      {
        type: String,
        trim: true,
        maxlength: 128,
      },
    ],
    weight: [
      {
        type: String,
        trim: true,
        maxlength: 128,
      },
    ],
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    highlights: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    tags: [
      {
        type: String,
      },
    ],
    price: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    discountRate: {
      type: Number,
      default: 0,
    },
    videoURL: [
      {
        type: String,
      },
    ],
    isVerified: {
      type: Date,
      default: null,
    },
    isRejected: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Date,
      default: null,
    },
    isFeatured: {
      type: Date,
      default: null,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    trendingScore: {
      type: Schema.Types.Decimal128,
      default: 0,
    },
    noOfSoldOut: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      unique: true,
    },
    availableDistricts: [
      {
        type: String,
        enum: districts,
        required: true,
      },
    ],
    remark: [
      {
        type: Schema.Types.ObjectId,
        ref: 'remark',
      },
    ],
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(URLSlugs('name', { field: 'slug', update: true }));

export default mongoose.model<IProduct>('product', productSchema);
