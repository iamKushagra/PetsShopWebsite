const Category = require('../models/Category')
const {errorHandler} = require('../helpers/dbErrorHandler')


exports.categoryById = (req, res, next, id)=>{
  Category.findById(id).exec((err, category)=>{
    if(err || !category){
      return res.status(400).json({
        error: 'Category does not exist'
      })
    }
    req.category = category
    next()
  })
}

exports.create = (req, res) => {

    const category = new Category(req.body)
    category.save((err, data)=>{
      if(err){
        return res.status(400).json({
          error: errorHandler(err)
        })
      }

      res.json({data})

    })
}

exports.read = (req, res) => {
  return res.status(200).json({
    category: req.category
  })
}

exports.list = async (req, res) => {
  let categories = await Category.find()
  console.log('categories: ',categories)
  res.status(200).json({
    categories: categories
  })
}

exports.update = (req, res)=>{
  console.log(req.category)
  console.log(req.body)
  Category.findByIdAndUpdate(
    req.params.categoryId, 
    req.body, 
    {new: true, runValidators: true}, 
    (err, updated)=>{
      if(err){
        return res.status(400).json({
          error: errorHandler(err)
        })
      }

      res.status(200).json({
        message: `Category ${req.params.categoryId} was sucessfully updated.`,
        category: updated
      })
  })
  
}

exports.remove = (req, res)=>{
  let category = req.category
  category.remove((err, success)=>{
    if(err){
      return res.status(400).json({
        error: errorHandler(err)
      })
    }
    res.status(202).json({message: `Category with id of ${req.params.categoryId} was successfully deleted.`})
  })
}

