import { Document, Schema, model, Types } from 'mongoose';


enum NotificationType {
  ORDER = 'order',
  QUESTION_ON_PRODUCT = 'question_on_product',
  ANSWER_ON_PRODUCT = 'answer_on_product',
  REVIEW = 'review'
}

interface INotificationItem {
  notificationType: NotificationType;
  notificationDetail: Record<string, any>;
  hasRead: boolean;
  date: Date;
  
}


interface INotification extends Document {
  admin: Types.ObjectId;
  notifications: INotificationItem[];
  noOfUnseen: number;
}


const notificationSchema = new Schema<INotification>({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'admin',
  },
  notifications: [{
    notificationType: {
      type: String,
      enum: Object.values(NotificationType),
      required: true
    },
    notificationDetail: {
      type: Object,
      required: true
    },
    hasRead: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: Date.now
    },
    
  }],
  noOfUnseen: {
    type: Number,
    default: 0
  }
});


const Notification = model<INotification>('notification', notificationSchema);
export default Notification;