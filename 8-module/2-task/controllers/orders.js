const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;
  const user = ctx.user._doc;

  const order = new Order({user: user._id, product, phone, address});
  await order.save();

  const orderId = order._doc._id.toString();

  const prod = await Product.findById(product);

  const {title} = prod._doc;

  await sendMail({
    template: 'order-confirmation',
    locals: {
      id: orderId,
      product: {
        title,
      },
    },
    to: user.email,
    subject: 'Подтверждение заказа',
  });

  ctx.body = {order: orderId};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const userId = ctx.user._doc._id;

  const ordersList = await Order.find({user: userId}).populate('product');

  resp = {
    orders: ordersList.map((order) => mapOrder(order)),
  };

  ctx.status = 200;
  ctx.body = resp;
};

