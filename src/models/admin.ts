import mongoose, { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';


interface IPoint {
  type: 'Point';
  coordinates: [number, number];
}

interface IHolidayMode {
  start?: number;
  end?: number;
}

interface IAdmin extends Document {
  name: string;
  shopName?: string;
  address?: string;
  geolocation?: IPoint;
  shippingRate?: number;
  shippingCost?: number;
  district?: string;
  municipality?: string;
  wardno?: number;
  businessInfo?: mongoose.Types.ObjectId;
  adminBank?: mongoose.Types.ObjectId;
  adminWareHouse?: mongoose.Types.ObjectId;
  phone?: number;
  email: string;
  password: string;
  photo?: string;
  holidayMode?: IHolidayMode;
  salt: string;
  role: 'admin' | 'superadmin';
  resetPasswordLink: string;
  emailVerifyLink: string;
  isVerified: Date | null;
  isBlocked: Date | null;
  createdAt: Date;
  updatedAt: Date;

  
  comparePassword(password: string): Promise<boolean>;
}

interface IAdminModel extends Model<IAdmin> {
  findByCredentials(email: string, password: string): Promise<IAdmin | null>;
}


const pointSchema = new Schema<IPoint>({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: (coords: number[]) => coords.length === 2,
      message: 'Coordinates must be an array of [longitude, latitude]'
    }
  }
});


const adminSchema = new Schema<IAdmin, IAdminModel>({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32
  },
  shopName: {
    type: String,
    trim: true,
    maxlength: 32
  },
  address: {
    type: String,
    trim: true,
    maxlength: 32
  },
  geolocation: {
    type: pointSchema
  },
  shippingRate: {
    type: Number
  },
  shippingCost: {
    type: Number
  },
  district: {
    type: String,
    trim: true,
    maxlength: 32
  },
  municipality: {
    type: String,
    trim: true,
    maxlength: 32,
    
  },
  wardno: {
    type: Number
  },
  businessInfo: {
    type: Schema.Types.ObjectId,
    ref: 'BusinessInfo'
  },
  adminBank: {
    type: Schema.Types.ObjectId,
    ref: 'AdminBank'
  },
  adminWareHouse: {
    type: Schema.Types.ObjectId,
    ref: 'AdminWarehouse'
  },
  phone: {
    type: Number,
    max: 9999999999,
    validate: {
      validator: (v: number) => v.toString().length <= 10,
      message: 'Phone number must be 10 digits or less'
    }
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  photo: {
    type: String
  },
  holidayMode: {
    start: { type: Number },
    end: { type: Number }
  },
  salt: {
    type: String
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin'
  },
  resetPasswordLink: {
    type: String,
    default: ''
  },
  emailVerifyLink: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Date,
    default: null
  },
  isBlocked: {
    type: Date,
    default: null
  }
}, { timestamps: true });


adminSchema.index({ geolocation: '2dsphere' });
adminSchema.index({ email: 1 }, { unique: true });


const sha512 = (password: string, salt: string): string => {
  return crypto.createHmac('sha512', salt)
    .update(password)
    .digest('hex');
};


adminSchema.pre<IAdmin>('save', function(next) {
  if (!this.isModified('password')) return next();

  const generateSalt = (length = 16): string => {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  };

  try {
    const salt = generateSalt();
    this.salt = salt;
    this.password = sha512(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});


adminSchema.methods.comparePassword = function(password: string): boolean {
  return this.password === sha512(password, this.salt);
};


adminSchema.statics.findByCredentials = async function(
  email: string, 
  password: string
): Promise<IAdmin | null> {
  const admin = await this.findOne({ email });
  if (!admin) return null;
  
  const isMatch = admin.comparePassword(password);
  return isMatch ? admin : null;
};

// Model
const Admin: IAdminModel = mongoose.model<IAdmin, IAdminModel>('Admin', adminSchema);

export default Admin;