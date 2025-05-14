import { sendEmail } from "@/middlewares/helpers/mailer";
import asyncErrorHandler from "@/middlewares/helpers/asyncErrorHandler";
import { ErrorHandler } from "@/lib/utils/errorHandler";
import Order from "@/models/order";
import Product from "@/models/product";


export const newOrder = asyncErrorHandler(async (req, res, next) => {
  const { shippingInfo, orderItems, paymentInfo, totalPrice } = req.body;
  const user = req.user;

  const orderExist = await Order.findOne({ paymentInfo });
  if (orderExist) return next(new ErrorHandler('Order Already Placed', 409)); // 409 Conflict

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    totalPrice,
    paidAt: Date.now(),
    user: user._id,
  });

  await sendEmail({
    email: user.email,
    templateId: process.env.SENDGRID_ORDER_TEMPLATEID || '',
    data: {
      name: user.name,
      shippingInfo,
      orderItems,
      totalPrice,
      oid: order._id,
    },
  });

  res.status(201).json({ success: true, order }); // 201 Created
});


export const getSingleOrderDetails = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.query.id).populate('user', 'name email');
  if (!order) return next(new ErrorHandler('Order Not Found', 404));

  res.status(200).json({ success: true, order }); // 200 OK
});


export const myOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  if (!orders || orders.length === 0) return next(new ErrorHandler('No Orders Found', 404));

  res.status(200).json({ success: true, orders }); // 200 OK
});


export const getAllOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find();
  if (!orders || orders.length === 0) return next(new ErrorHandler('No Orders Found', 404));

  const totalAmount = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  res.status(200).json({ success: true, orders, totalAmount }); // 200 OK
});

export const updateOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.query.id);
  if (!order) return next(new ErrorHandler('Order Not Found', 404));

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHandler('Order Already Delivered', 400)); // 400 Bad Request
  }

  if (req.body.status === 'Shipped') {
    order.shippedAt = Date.now();
    for (const item of order.orderItems) {
      await updateStock(item.product, item.quantity);
    }
  }

  order.orderStatus = req.body.status;
  if (req.body.status === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: 'Order updated successfully' }); // 200 OK
});

const updateStock = async (id, quantity) => {
  const product = await Product.findById(id);
  if (product) {
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
  }
};


export const deleteOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.query.id);
  if (!order) return next(new ErrorHandler('Order Not Found', 404));

  await order.remove();

  res.status(200).json({ success: true, message: 'Order deleted successfully' }); // 200 OK
});
