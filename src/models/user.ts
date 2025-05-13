import mongoose, { Schema, Document, Types, Model } from 'mongoose';
import crypto from 'crypto';


interface ILocation {
  _id: Types.ObjectId;
}

interface IUserMethods {
  
}

interface UserModel extends Model<UserDocument, {}, IUserMethods> {
  findByCredentials(email: string, password: string): Promise<UserDocument | null>;
}

interface UserDocument extends Document {
  name: string;
  email?: string;
  userID: string;
  loginDomain: 'system' | 'facebook' | 'google';
  password?: string;
  location: Types.ObjectId[];
  photo?: string;
  socialPhoto?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  resetPasswordLink: string;
  emailVerifyLink: string;
  salt?: string;
  isBlocked: Date | null;
  createdAt: Date;
  updatedAt: Date;
}


const userSchema = new Schema<UserDocument, UserModel, IUserMethods>({
  name: {
    type: String,
    trim: true,
    required: [true, 'Name is required'],
    maxlength: [32, 'Name cannot exceed 32 characters']
  },
  email: {
    type: String,
    trim: true,
    
    validate: {
      validator: (v: string) => /.+@.+\..+/.test(v),
      message: 'Please enter a valid email'
    }
  },
  userID: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  loginDomain: {
    type: String,
    default: "system",
    enum: ['system', 'facebook', 'google']
  },
  password: {
    type: String,
    
  },
  location: [{
    type: Schema.Types.ObjectId,
    ref: "address"
  }],
  photo: {
    type: String
  },
  socialPhoto: {
    type: String
  },
  dob: {
    type: String
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  resetPasswordLink: {
    type: String,
    default: ""
  },
  emailVerifyLink: {
    type: String,
    default: ""
  },
  salt: String,
  isBlocked: {
    type: Date,
    default: null
  }
}, { timestamps: true });


userSchema.index({ geolocation: "2dsphere" });


const sha512 = (password: string, salt: string): { passwordHash: string } => {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  const value = hash.digest('hex');
  return { passwordHash: value };
};


userSchema.pre<UserDocument>('save', function(next) {
  if (this.isModified('password') && this.password) {
    const ranStr = (n: number): string => {
      return crypto.randomBytes(Math.ceil(8))
        .toString('hex')
        .slice(0, n);
    };

    const salt = ranStr(16);
    const passwordData = sha512(this.password, salt);
    this.password = passwordData.passwordHash;
    this.salt = salt;
  }
  next();
});


userSchema.statics.findByCredentials = async function(email: string, password: string): Promise<UserDocument | null> {
  const user = await this.findOne({ email, loginDomain: 'system' });
  if (!user || !user.password || !user.salt) return null;
  
  const passwordData = sha512(password, user.salt);
  if (passwordData.passwordHash === user.password) {
    return user;
  }
  return null;
};

const User = mongoose.model<UserDocument, UserModel>("user", userSchema);
export default User;