import mongoose, { Schema, Document, Types } from 'mongoose';

interface SocketMappingDocument extends Document {
  user?: Types.ObjectId;  
  socketId: string;
}

const socketMappingSchema = new Schema<SocketMappingDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "admin"
  },
  socketId: {
    type: String,
    required: [true, 'Socket ID is required'],
    unique: true  
  }
}, { timestamps: true });  

const SocketMapping = mongoose.model<SocketMappingDocument>('socketmapping', socketMappingSchema);
export default SocketMapping;