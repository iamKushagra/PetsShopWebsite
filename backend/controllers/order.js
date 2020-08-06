const errorHandler = require('../helpers/dbErrorHandler')
const {CartItem, Order} = require('../models/CartItemAndOrder')

exports.create = (req, res) => {
  console.log('CREATE ORDER req.body: ', req.body)
  req.body.order.user = req.profile
  const order = new Order(req.body.order)
  order.save((error, data)=>{
    if(error){
      return res.status(400).json({
        error: errorHandler(error)
      })
    }

    res.json(data)
  })
}


exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No orders found"
        });
      }
      req.order = order;
      next();
    });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No orders found"
        });
      }
      res.json(order);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: "Unable update order status"
        });
      }
      res.json(order);
    }
  );
};

