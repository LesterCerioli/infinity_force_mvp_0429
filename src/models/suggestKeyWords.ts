import mongoose, { Schema, Document } from 'mongoose';

interface SuggestKeywordDocument extends Document {
  keyword: string;
  isDeleted: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const suggestKeywordSchema = new Schema<SuggestKeywordDocument>({
  keyword: {
    type: String,
    unique: true,
    required: [true, 'Keyword is required'],
    trim: true,
    minlength: [2, 'Keyword must be at least 2 characters'],
    maxlength: [50, 'Keyword cannot exceed 50 characters']
  },
  isDeleted: {
    type: Date,
    default: null
  }
}, { timestamps: true });

const SuggestKeyword = mongoose.model<SuggestKeywordDocument>('suggestkeyword', suggestKeywordSchema);
export default SuggestKeyword;