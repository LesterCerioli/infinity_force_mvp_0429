import mongoose, { Schema, Document } from 'mongoose';

interface TokenDocument extends Document {
  refreshToken: string;
  userIP?: string;
}

const tokenSchema = new Schema<TokenDocument>({
  refreshToken: {
    type: String,
    default: '',
    trim: true
  },
  userIP: {
    type: String,
    trim: true
  }
  // Commented out fields for potential future use:
  // user: {
  //   type: Schema.Types.ObjectId,
  //   refPath: "sysUsers",
  // },
  // expires: {
  //   type: Date
  // },
  // sysUsers: {
  //   type: String,
  //   enum: ['user', 'admin', 'dispatcher']
  // }
}, { timestamps: true });

const RefreshToken = mongoose.model<TokenDocument>('refreshtoken', tokenSchema);
export default RefreshToken;