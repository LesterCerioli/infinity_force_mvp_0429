import { Document, Schema, model, Types } from 'mongoose';

interface IForYouItem {
  user: Types.ObjectId;
  products: Types.ObjectId[];
}

interface IMinedProduct extends Document {
  forYou: IForYouItem[];
}

const forYouSchema = new Schema<IMinedProduct>({
  forYou: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      unique: true,
      required: true
    },
    products: [{
      type: Schema.Types.ObjectId,
      ref: 'product',
      unique: true
    }]
  }]
});

const MinedProduct = model<IMinedProduct>('minedproduct', forYouSchema);
export default MinedProduct;