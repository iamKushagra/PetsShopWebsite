const User = require('../models/User')

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user)=>{
    if(err||!user){
      return res.status(400).json({
        error: 'User not found'
        
      })
    }
    user.salt = undefined
    user.hashed_password = undefined
    req.profile = user;
    next()
  })
  console.log(req.body)
}

exports.read = (req, res)=>{
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}


exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No Order Found"
        });
      }
      return res.json(order);
    });
};

exports.update = (req, res)=>{
  console.log('user upadate req.profile: ', req.profile)
  console.log('\nuser upadate req.body: ', req.body)
  User.findOneAndUpdate(
    {_id: req.profile._id}, 
    {$set: req.body}, 
    {new: true},
    (err, user) => {
      if(err){
        return res.status(400).json({
          error: 'You are not authorized to perform this action'
        })
      }
    user.salt = undefined
    user.hashed_password = undefined
    res.json(user)
    })
    
}
// middleware to add order history to the User object.
exports.addOrderToUserHistor = (req, res, next) => {
  let history = []

  req.body.products.forEach((item)=>{
    history.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.count,
      transaction_id: req.body.transaction_id,
      amount: req.body.amount
    })
  })

  User.findByIdAndUpdate(
    {_id: req.profile._id}, 
    {$push: {history: history}}, 
    {new: true}, 
    (error, data)=>{
      if(error){
        return res.status(400).json({
          error: 'Could not update user purchase.'
        })
      }

      next()
    }
    )

}