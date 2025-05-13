import mongoose, { Schema, Document, Model, Types } from 'mongoose';


interface IAdminWarehouse extends Document {
  admin: Types.ObjectId;
  name: string;
  address: string;
  phoneno: string;
  city: string;
  isVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}


const warehouseSchema = new Schema<IAdminWarehouse>({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Admin reference is required'],
    index: true
  },
  name: {
    type: String,
    trim: true,
    required: [true, 'Warehouse name is required'],
    maxlength: [32, 'Warehouse name cannot exceed 32 characters']
  },
  address: {
    type: String,
    trim: true,
    required: [true, 'Address is required'],
    maxlength: [32, 'Address cannot exceed 32 characters']
  },
  phoneno: {
    type: String,
    trim: true,
    required: [true, 'Phone number is required'],
    maxlength: [32, 'Phone number cannot exceed 32 characters'],
    validate: {
      validator: (phone: string) => {
        
        return /^[+]?[\d\s-]{10,32}$/.test(phone);
      },
      message: 'Please enter a valid phone number'
    }
  },
  city: {
    type: String,
    trim: true,
    required: [true, 'City is required'],
    maxlength: [32, 'City name cannot exceed 32 characters']
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


warehouseSchema.index({ name: 1, admin: 1 }, { unique: true }); // Ensure unique warehouse names per admin


const AdminWarehouse: Model<IAdminWarehouse> = mongoose.model<IAdminWarehouse>(
  'AdminWarehouse', 
  warehouseSchema
);

export default AdminWarehouse;