import mongoose, { Schema, Document, Types } from 'mongoose';

interface QnAEntry {
  question?: string;
  questionby?: Types.ObjectId;
  questionedDate?: Date;
  answer?: string;
  answerby?: Types.ObjectId;
  answeredDate?: Date;
  isDeleted: Date | null;
}

interface QnADocument extends Document {
  product: Types.ObjectId;
  qna: QnAEntry[];
}

const qnaSchema = new Schema<QnADocument>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
    required: [true, 'Product reference is required']
  },
  qna: [{
    question: {
      type: String,
      trim: true
    },
    questionby: {
      type: Schema.Types.ObjectId,
      ref: "user"
    },
    questionedDate: {
      type: Date,
      default: Date.now
    },
    answer: {
      type: String,
      trim: true
    },
    answerby: {
      type: Schema.Types.ObjectId,
      ref: "admin"
    },
    answeredDate: {
      type: Date
    },
    isDeleted: {
      type: Date,
      default: null
    }
  }]
}, { timestamps: true });

const QnA = mongoose.model<QnADocument>("qna", qnaSchema);
export default QnA;