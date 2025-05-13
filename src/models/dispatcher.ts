import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import crypto from 'crypto';


interface IDispatcher extends Document {
  name: string;
  address?: string;
  phone?: number;
  email: string;
  password: string;
  salt: string;
  resetPasswordLink: string;
  isBlocked: Date | null;
  createdAt: Date;
  updatedAt: Date;
  
  comparePassword(password: string): boolean;
}

interface IDispatcherModel extends Model<IDispatcher> {
  findByCredentials(email: string, password: string): Promise<IDispatcher | null>;
}


const dispatcherSchema = new Schema<IDispatcher, IDispatcherModel>({
  name: {
    type: String,
    trim: true,
    required: [true, 'Name is required'],
    maxlength: [32, 'Name cannot exceed 32 characters']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [32, 'Address cannot exceed 32 characters']
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
    required: [true, 'Email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  salt: {
    type: String
  },
  resetPasswordLink: {
    type: String,
    default: ""
  },
  isBlocked: {
    type: Date,
    default: null
  }
}, { timestamps: true });


const sha512 = (password: string, salt: string): string => {
  return crypto.createHmac('sha512', salt)
    .update(password)
    .digest('hex');
};


dispatcherSchema.pre<IDispatcher>('save', function(next) {
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


dispatcherSchema.methods.comparePassword = function(password: string): boolean {
  return this.password === sha512(password, this.salt);
};

dispatcherSchema.statics.findByCredentials = async function(
  email: string, 
  password: string
): Promise<IDispatcher | null> {
  const dispatcher = await this.findOne({ email });
  if (!dispatcher) return null;
  
  const isMatch = dispatcher.comparePassword(password);
  return isMatch ? dispatcher : null;
};


dispatcherSchema.index({ email: 1 }, { unique: true });
dispatcherSchema.index({ isBlocked: 1 });

const Dispatcher: IDispatcherModel = mongoose.model<IDispatcher, IDispatcherModel>(
  'Dispatcher', 
  dispatcherSchema
);

export default Dispatcher;