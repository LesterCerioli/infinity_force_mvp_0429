import mongoose, { Schema, Document } from 'mongoose';

interface IForYouEntry {
  user: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
}

interface IForYouDocument extends Document {
  forYou: IForYouEntry[];
}

const forYouSchema = new Schema<IForYouDocument>({
  forYou: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        unique: true,
        required: true
      },
      products: [
        {
          type: Schema.Types.ObjectId,
          ref: 'product',
          unique: true
        }
      ]
    }
  ]
});

const MinedProduct = mongoose.model<IForYouDocument>('minedproduct', forYouSchema);

export default MinedProduct;
