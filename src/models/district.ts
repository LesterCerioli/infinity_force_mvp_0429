import mongoose, { Schema, Document, Model } from 'mongoose';
import { districts } from '../middleware/common';


interface IDistrict extends Document {
  name: typeof districts[number]; 
  createdAt: Date;
  updatedAt: Date;
}


const districtSchema = new Schema<IDistrict>({
  name: {
    type: String,
    unique: true,
    enum: districts,
    required: [true, 'District name is required']
  }
}, { 
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v; 
      return ret;
    }
  }
});


districtSchema.index({ name: 1 }, { unique: true });


const District: Model<IDistrict> = mongoose.model<IDistrict>('District', districtSchema);

export default District;