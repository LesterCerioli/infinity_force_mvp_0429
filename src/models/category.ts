import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import URLSlugs from 'mongoose-url-slugs';

interface ICategory extends Document {
  systemName: string;
  displayName: string;
  parent?: Types.ObjectId;
  brands: Types.ObjectId[];
  slug: string;
  isDisabled: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
const categorySchema = new Schema<ICategory>({
  systemName: {
    type: String,
    trim: true,
    required: [true, 'System name is required'],
    maxlength: [32, 'System name cannot exceed 32 characters'],
    unique: true
  },
  displayName: {
    type: String,
    trim: true,
    required: [true, 'Display name is required'],
    maxlength: [32, 'Display name cannot exceed 32 characters']
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'ProductBrand',
    index: true
  },
  brands: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    index: true
  }],
  slug: {
    type: String,
    unique: true,
    index: true
  },
  isDisabled: {
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


categorySchema.plugin(URLSlugs('displayName', { 
  field: 'slug', 
  update: true,
  unique: true,
  separator: '-'
}));


categorySchema.index({ systemName: 1 }, { unique: true });
categorySchema.index({ slug: 1 }, { unique: true });


categorySchema.virtual('parentCategory', {
  ref: 'Category',
  localField: 'parent',
  foreignField: '_id',
  justOne: true
});


const Category: Model<ICategory> = mongoose.model<ICategory>('Category', categorySchema);

export default Category;