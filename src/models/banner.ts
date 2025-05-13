import mongoose, { Schema, Document, Model, Types } from 'mongoose';


interface IBanner extends Document {
  bannerPhoto?: string;
  link?: string;
  product?: Types.ObjectId;
  isDeleted: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
const bannerSchema = new Schema<IBanner>({
  bannerPhoto: {
    type: String,
    validate: {
      validator: (url: string) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid banner photo URL'
    }
  },
  link: {
    type: String,
    validate: {
      validator: (url: string) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid link URL'
    }
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product', 
    index: true
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


bannerSchema.index({ isDeleted: 1 }); // For soft delete queries
bannerSchema.index({ createdAt: -1 }); // For sorting by newest


const Banner: Model<IBanner> = mongoose.model<IBanner>('Banner', bannerSchema);

export default Banner;