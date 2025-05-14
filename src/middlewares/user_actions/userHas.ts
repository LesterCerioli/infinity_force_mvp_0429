import Cart from "@/models/cart";
import Order from "@/models/order";
import Review from "@/models/review";

interface Product {
  _id: string;
}

interface User {
  _id: string;
}

interface HasProductStatus {
  hasBought: boolean | null;
  hasOnCart: boolean | null;
  hasOnWishlist: boolean | null;
  hasReviewed: boolean | null;
}

export default async function checkProductStatus(
  product: Product,
  user: User | null,
  type: string
): Promise<HasProductStatus> {
  let hasOnCart: boolean | null = null;
  let hasBought: boolean | null = null;
  let hasOnWishlist: boolean | null = null;
  let hasReviewed: boolean | null = null;

  if (user) {
    
    if (type !== 'carts') {
      hasOnCart = await Cart.findOne({ user: user._id, product: product._id, isDeleted: null });
      if (!hasOnCart) hasOnCart = false;
    }

    
    if (type !== 'wishlists') {
      hasOnWishlist = await Wishlist.findOne({ user: user._id, product: product._id, isDeleted: null });
      if (!hasOnWishlist) hasOnWishlist = false;
    }

    
    if (type === 'product') {
      
      hasBought = await Order.findOne({
        user: user,
        $or: [
          { 'status.currentStatus': 'complete' },
          { 'status.currentStatus': 'tobereturned' },
          { 'status.currentStatus': 'return' },
        ],
      });
      hasBought = hasBought ? true : false;

      
      hasReviewed = await Review.findOne({ user: user._id, product: product._id }).select('comment star user');
      if (!hasReviewed) hasReviewed = false;
    }
  }

  return {
    hasBought,
    hasOnCart,
    hasOnWishlist,
    hasReviewed,
  };
}
