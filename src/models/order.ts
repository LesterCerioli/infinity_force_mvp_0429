import mongoose, { Schema, Document, Types } from 'mongoose';
import { allOrderStatus } from '../middleware/common';

interface Point {
  type: 'Point';
  coordinates: [number, number];
}

interface DispatchedDetail {
  dispatchedDate: Date | null;
  dispatchedBy: Types.ObjectId;
}

interface CancelledDetail {
  cancelledDate: Date | null;
  cancelledBy: Types.ObjectId;
  remark: Types.ObjectId;
}

interface ReturnedDetail {
  returnedDate: Date | null;
  returneddBy: Types.ObjectId;
  remark: Types.ObjectId[];
}

interface OrderStatus {
  currentStatus: string;
  activeDate: Date | null;
  approvedDate: Date | null;
  dispatchedDetail: DispatchedDetail;
  cancelledDetail: CancelledDetail;
  completedDate: Date | null;
  tobereturnedDate: Date | null;
  returnedDetail: ReturnedDetail;
}

interface ShipTo {
  region: string;
  city: string;
  area: string;
  address: string;
  geolocation: Point;
  phoneno: string;
}

interface OrderDocument extends Document {
  user: Types.ObjectId;
  orderID: string;
  product: Types.ObjectId;
  payment?: Types.ObjectId;
  quantity?: number;
  soldBy?: Types.ObjectId;
  status: OrderStatus;
  shipto: ShipTo;
  isPaid: boolean;
  cancelledByModel?: 'user' | 'admin';
  productAttributes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const pointSchema = new Schema<Point>({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const orderSchema = new Schema<OrderDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  orderID: {
    type: String,
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
    required: true
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: "payment",
  },
  quantity: {
    type: Number
  },
  soldBy: {
    type: Schema.Types.ObjectId,
    ref: "admin"
  },
  status: {
    currentStatus: {
      type: String,
      enum: allOrderStatus
    },
    activeDate: {
      type: Date,
      default: null
    },
    approvedDate: {
      type: Date,
      default: null
    },
    dispatchedDetail: {
      dispatchedDate: {
        type: Date,
        default: null
      },
      dispatchedBy: {
        type: Schema.Types.ObjectId,
        ref: 'dispatcher'
      },
    },
    cancelledDetail: {
      cancelledDate: {
        type: Date,
        default: null
      },
      cancelledBy: {
        type: Schema.Types.ObjectId,
        refPath: "cancelledByModel"
      },
      remark: {
        type: Schema.Types.ObjectId,
        ref: 'remark'
      },
    },
    completedDate: {
      type: Date,
      default: null
    },
    tobereturnedDate: {
      type: Date,
      default: null
    },
    returnedDetail: {
      returnedDate: {
        type: Date,
        default: null
      },
      returneddBy: {
        type: Schema.Types.ObjectId,
        ref: 'dispatcher'
      },
      remark: [{
        type: Schema.Types.ObjectId,
        ref: 'remark'
      }],
    },
  },
  shipto: {
    region: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    geolocation: {
      type: pointSchema,
    },
    phoneno: {
      type: String,
      trim: true,
      maxlength: 10,
    }
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  cancelledByModel: {
    type: String,
    enum: ['user', 'admin']
  },
  productAttributes: {
    type: String
  }
}, { timestamps: true });

orderSchema.index({ geolocation: "2dsphere" });

const Order = mongoose.model<OrderDocument>("order", orderSchema);
export default Order;