const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const user = ctx.user;

  if (!user) {
    ctx.throw(401, 'Пользователь не авторизован.');
  }

  const order = new Order({
    product: ctx.request.body.product,
    phone: ctx.request.body.phone,
    address: ctx.request.body.address,
    user: user._id,
  });

  await order.save();

  await sendMail({
    template: 'order-confirmation',
    locals: {id: order._id, product: order.product},
    to: ctx.user.email,
    subject: 'Подтверждение заказа',
  });

  ctx.body = {order: order['_id']};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const user = ctx.user;

  if (!user) {
    ctx.throw(401, 'Пользователь не авторизован.');
  }

  const orders = await Order.find({user}).populate('product');
  ctx.body = {orders};
};
