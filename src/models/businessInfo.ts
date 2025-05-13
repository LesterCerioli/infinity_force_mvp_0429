import mongoose, { Schema, Document, Model, Types } from 'mongoose';


interface IBusinessInfo extends Document {
  admin: Types.ObjectId;
  ownerName: string;
  address: string;
  city: string;
  citizenshipNumber: string;
  businessRegisterNumber: string;
  citizenshipFront?: Types.ObjectId;
  citizenshipBack?: Types.ObjectId;
  businessLicence?: Types.ObjectId;
  isVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}


const businessSchema = new Schema<IBusinessInfo>({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Admin reference is required'],
    index: true
  },
  ownerName: {
    type: String,
    trim: true,
    required: [true, 'Owner name is required'],
    maxlength: [32, 'Owner name cannot exceed 32 characters']
  },
  address: {
    type: String,
    trim: true,
    required: [true, 'Address is required'],
    maxlength: [32, 'Address cannot exceed 32 characters']
  },
  city: {
    type: String,
    trim: true,
    required: [true, 'City is required'],
    maxlength: [32, 'City name cannot exceed 32 characters']
  },
  citizenshipNumber: {
    type: String,
    trim: true,
    required: [true, 'Citizenship number is required'],
    maxlength: [32, 'Citizenship number cannot exceed 32 characters'],
    validate: {
      validator: (value: string) => /^[a-zA-Z0-9]+$/.test(value),
      message: 'Citizenship number must be alphanumeric'
    }
  },
  businessRegisterNumber: {
    type: String,
    trim: true,
    required: [true, 'Business register number is required'],
    maxlength: [32, 'Business register number cannot exceed 32 characters'],
    validate: {
      validator: (value: string) => /^[a-zA-Z0-9]+$/.test(value),
      message: 'Business register number must be alphanumeric'
    }
  },
  citizenshipFront: {
    type: Schema.Types.ObjectId,
    ref: 'AdminFile'
  },
  citizenshipBack: {
    type: Schema.Types.ObjectId,
    ref: 'AdminFile'
  },
  businessLicence: {
    type: Schema.Types.ObjectId,
    ref: 'AdminFile'
  },
  isVerified: {
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


businessSchema.index({ admin: 1, isVerified: 1 }); // For admin verification queries
businessSchema.index({ citizenshipNumber: 1 }, { unique: true }); // Unique citizenship number
businessSchema.index({ businessRegisterNumber: 1 }, { unique: true }); // Unique business number


const BusinessInfo: Model<IBusinessInfo> = mongoose.model<IBusinessInfo>(
  'BusinessInfo', 
  businessSchema
);

export default BusinessInfo;