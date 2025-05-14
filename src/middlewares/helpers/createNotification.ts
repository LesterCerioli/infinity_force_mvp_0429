import { Server as SocketIOServer } from "socket.io";
import Notification from "../../models/Notification";
import SocketMapping from "../../models/SocketMapping";
import { dropRight } from "lodash";
import { Types } from "mongoose";

interface NotificationPayload {
  message: string;
  [key: string]: any; // Additional properties as needed
}

const sendAdminNotification = async (
  io: SocketIOServer,
  adminId: Types.ObjectId | string,
  notificationObj: NotificationPayload
): Promise<void> => {
  
  let notificationDoc = await Notification.findOne({ admin: adminId });

  if (!notificationDoc) {
    notificationDoc = new Notification({
      admin: adminId,
      notifications: [notificationObj],
      noOfUnseen: 1,
    });
    await notificationDoc.save();
  } else {
    const notifications = notificationDoc.notifications;
    notifications.unshift(notificationObj);
    notificationDoc.noOfUnseen += 1;

    if (notificationDoc.noOfUnseen < 20 && notifications.length > 20) {
      notificationDoc.notifications = dropRight(notifications, notifications.length - 20);
    }

    await notificationDoc.save();
  }
 
  const socketUsers = await SocketMapping.find({ user: adminId });

  socketUsers.forEach((u: { socketId: string }) => {
    io.to(u.socketId).emit("notification", {
      noOfUnseen: notificationDoc!.noOfUnseen,
    });
  });
};

export default sendAdminNotification;
