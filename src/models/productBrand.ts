import mongoose, { Schema, Document } from 'mongoose';
import URLSlugs from 'mongoose-url-slugs';

interface BrandDocument extends Document {
  brandName?: string;
  systemName?: string;
  slug?: string;
}

const brandSchema = new Schema<BrandDocument>({
  brandName: {
    type: String,
    trim: true
  },
  systemName: {
    type: String,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    trim: true,
    unique: true
  }
});

brandSchema.plugin(URLSlugs('brandName', { 
  field: 'slug', 
  update: true 
}));

const ProductBrand = mongoose.model<BrandDocument>("productbrand", brandSchema);
export default ProductBrand;