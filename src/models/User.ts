import mongoose, { Document, Model, Schema } from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Custom password hashing function (from original User.js)
const sha512 = (password: string, salt: string) => {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return {
        passwordHash: value,
    };
};

export interface IUser extends Document {
  name: string;
  email: string;
  userID?: string; // Was in original, optional for now
  loginDomain: 'system' | 'facebook' | 'google';
  password?: string; // Optional because it might not be selected, or user logs in via social
  // location: Schema.Types.ObjectId[]; // Commenting out for now, address model not migrated
  photo?: string;
  socialPhoto?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  // resetPasswordLink?: string; // Handled by tokens directly
  // emailVerifyLink?: string; // Handled by tokens/logic directly
  salt?: string;
  isBlocked?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(enteredPassword: string): boolean;
  getJwtToken(): string;
  // getResetPasswordToken(): string; // Will be handled in authUtils or service layer
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please enter your name'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'Please enter your email'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  userID: { // Retaining from original schema, ensure it's handled during registration if needed
    type: String,
    trim: true,
    unique: true,
    sparse: true, // Allows multiple null/undefined values if not required
  },
  loginDomain: {
    type: String,
    default: 'system',
    enum: ['system', 'facebook', 'google'],
  },
  password: {
    type: String,
    // required: [true, 'Please enter your password'], // Not always required (e.g. social login)
    minlength: [6, 'Password must be longer than 6 characters'],
    select: false, // important: password will not be returned by default
  },
  // location: [{ // Commenting out for now
  //   type: Schema.Types.ObjectId,
  //   ref: "address"
  // }],
  photo: {
    type: String,
  },
  socialPhoto: {
    type: String,
  },
  dob: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  // resetPasswordLink and emailVerifyLink are removed as they are better handled by generating tokens on the fly
  salt: {
    type: String,
    select: false,
  },
  isBlocked: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

// Pre-save hook for password hashing (from original User.js)
userSchema.pre<IUser>('save', function (next) {
  if (!this.isModified('password') || !this.password) {
    next();
    return;
  }
  const ranStr = (n: number) => {
    return crypto.randomBytes(Math.ceil(n / 2)).toString('hex').slice(0, n);
  };
  this.salt = ranStr(16);
  const passwordData = sha512(this.password, this.salt);
  this.password = passwordData.passwordHash;
  next();
});

// Method to compare password (adapted from original User.js)
userSchema.methods.comparePassword = function (enteredPassword: string): boolean {
  if (!this.password || !this.salt) return false;
  const passwordData = sha512(enteredPassword, this.salt);
  return passwordData.passwordHash === this.password;
};

// Method to get JWT token
userSchema.methods.getJwtToken = function (): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME || '7d', // Default to 7 days if not set
  });
};

// Ensure model is not recompiled if already exists
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
