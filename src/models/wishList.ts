import mongoose, { Schema, Document } from 'mongoose';


interface IWishList extends Document {
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    quantity: number;
    isDeleted: Date | null;
}

const wishSchema: Schema<IWishList> = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    isDeleted: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const WishList = mongoose.model<IWishList>('wishlist', wishSchema);

export default WishList;
