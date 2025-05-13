import mongoose, { Schema, Document, Model, Types } from 'mongoose';


interface IAdminFile extends Document {
  admin?: Types.ObjectId;  
  fileUri: string;
  createdAt: Date;
  updatedAt: Date;
}
const adminFileSchema = new Schema<IAdminFile>({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',  
    index: true    
  },
  fileUri: {
    type: String,
    required: [true, 'File URI is required'],
    validate: {
      validator: (uri: string) => {
        
        try {
          new URL(uri);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid file URI format'
    }
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


adminFileSchema.virtual('filename').get(function(this: IAdminFile) {
  return this.fileUri.split('/').pop();
});


const AdminFile: Model<IAdminFile> = mongoose.model<IAdminFile>('AdminFile', adminFileSchema);

export default AdminFile;