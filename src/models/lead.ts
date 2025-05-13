import mongoose, { Schema, Document, Model, Types } from 'mongoose';


interface ILead extends Document {
  email: string;
  isDeleted: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
const leadSchema = new Schema<ILead>({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  isDeleted: {
    type: Date,
    default: null
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
leadSchema.index({ email: 1 }, { unique: true });
leadSchema.index({ isDeleted: 1 });


const Lead: Model<ILead> = mongoose.model<ILead>('Lead', leadSchema);

export default Lead;