import mongoose, { Schema, Document, Model, Types } from 'mongoose';


interface IAdminBank extends Document {
  admin: Types.ObjectId;
  accountHolder: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  routingNumber: string;
  chequeCopy?: Types.ObjectId;
  isVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}


const bankSchema = new Schema<IAdminBank>({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'Admin', 
    required: [true, 'Admin reference is required']
  },
  accountHolder: {
    type: String,
    trim: true,
    required: [true, 'Account holder name is required'],
    maxlength: [32, 'Account holder name cannot exceed 32 characters']
  },
  bankName: {
    type: String,
    trim: true,
    required: [true, 'Bank name is required'],
    maxlength: [32, 'Bank name cannot exceed 32 characters']
  },
  branchName: {
    type: String,
    trim: true,
    required: [true, 'Branch name is required'],
    maxlength: [32, 'Branch name cannot exceed 32 characters']
  },
  accountNumber: {
    type: String,
    trim: true,
    required: [true, 'Account number is required'],
    maxlength: [32, 'Account number cannot exceed 32 characters'],
    validate: {
      validator: (value: string) => /^[0-9]+$/.test(value),
      message: 'Account number must contain only numbers'
    }
  },
  routingNumber: {
    type: String,
    trim: true,
    required: [true, 'Routing number is required'],
    maxlength: [32, 'Routing number cannot exceed 32 characters'],
    validate: {
      validator: (value: string) => /^[0-9]+$/.test(value),
      message: 'Routing number must contain only numbers'
    }
  },
  chequeCopy: {
    type: Schema.Types.ObjectId,
    ref: 'AdminFile' 
  },
  isVerified: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


bankSchema.index({ admin: 1 });
bankSchema.index({ accountNumber: 1 }, { unique: true });


bankSchema.virtual('maskedAccountNumber').get(function(this: IAdminBank) {
  return `****${this.accountNumber.slice(-4)}`;
});


const AdminBank: Model<IAdminBank> = mongoose.model<IAdminBank>('AdminBank', bankSchema);

export default AdminBank;