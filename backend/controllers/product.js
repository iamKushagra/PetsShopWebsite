const formidable = require('formidable'); // for form data and image upload
const _ = require('lodash'); //provides some helper methods used in the update product method
const fs = require('fs');
const errorHandler = require('../helpers/dbErrorHandler');
const Product = require('../models/Product');

exports.productById = (req, res, next, id) => {
  // we get id by from the router.param('productId', productById). Id is a positional argument
  console.log(req.params);
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(404).json({
        error: `Product with id of ${req.params.productId} does not exist.`
      });
    }

    req.product = product;
    next();
  });
};

exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.json({
    product: req.product,
    category: req.category
  });
};

exports.remove = (req, res) => {
  let product = req.product;
  product.remove((err, success) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    res.status(202).json({
      message: `Product with id of ${req.params.productId} was successfully deleted.`
    });
  });
};
// CREATE NEW PRODUCT
exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      });
    }
    // check for all fields
    const {
      name,
      price,
      description,
      category,
      quantity,
      shipping
    } = fields;
    if (!name || !price || !description || !category || !quantity || !shipping) {
      return res.status(400).json({
        error: 'All fileds are required'
      });
    }
    let product = new Product(fields);

    if (files.photo) {
      // 1kb=1000 1mb = 1000000
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1MB in size.'
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }

      res.status(201).json({
        product: result
      });
    });
  });
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      });
    }
    // check for all fields
    const {
      name,
      price,
      description,
      category,
      quantity,
      shipping
    } = fields;
    if (!name || !price || !description || !category || !quantity || !shipping) {
      return res.status(400).json({
        error: 'All fileds are required'
      });
    }

    let product = req.product;
    product = _.extend(product, fields);

    if (files.photo) {
      // 1kb=1000 1mb = 1000000
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1MB in size.'
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: 'There was a problem updating your product.'
        });
      }

      res.status(201).json({
        product: result
      });
    });
  });
};

/* 
 * sell / arrival
 * by sell = products?sortBy=sold&order=desc&limit=4
 * by arrival = products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned

*/
exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : 'asc';
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
    .select('-photo')
    .populate('category')
    .sort([
      [sortBy, order]
    ])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          message: 'products not found'
        });
      }
      res.send(products);
    });
};

exports.listRelated = async (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  console.log('req.product: ', req.product);
  Product.find({
      _id: {
        $ne: req.product
      },
      category: req.product.category
    })
    .limit(limit)
    .populate('category', '_id, name')
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          message: 'products not found'
        });
      }
      res.send(products);
    });
};

exports.listCategories = (req, res) => {
  Product.distinct('category', {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: 'Not products found in this category'
      });
    }

    res.json({
      categories
    });
  });
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : 'desc';
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters)
  // console.log("findArgs", findArgs)

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1]
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select('-photo')
    .populate('category')
    .sort([
      [sortBy, order]
    ])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found'
        });
      }
      res.json({
        size: data.length,
        data
      });
    });
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }

  next();
};

exports.listSearch = (req, res) => {
  // create query object to hold search value and category value
  const query = {};
  // assign search value to query.name
  if (req.query.search) {
    // Mongoose $regex provides pattern matching in strings and queries
    query.name = {
      $regex: req.query.search,
      $options: 'i'
    };

    // find the product based on query object with 2 properties search and category
  }

  if (req.query.category && req.query.category !== 'All') {
    query.category = req.query.category;
  }

  Product.find(query, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    } else {
      res.json(products);
    }
  }).select('-photo');
};

exports.decreaseQuantity = (req, res, next) => {
  let bulkOps = req.body.products.map((item) => {
    return {
      updateOne: {
        filter: {
          _id: item._id
        },
        update: {
          $inc: {
            quantity: -item.count,
            sold: +item.count
          }
        } //decrement the product count and increment the number sold on each product by count purchased.
      }
    };
  });
  console.log('product.js controller decreaseQuantity bulkOps: ', bulkOps)

  Product.bulkWrite(bulkOps, {}, (error, products) => {
    if(error){
      return res.status(400).json({
        error: 'Could not update product.'
      })
    }
    next()
  });

  
  /* Notes on bulkWrite:
    bulkWrite(writes: any[], cb?: (err: any, res: BulkWriteOpResultObject) => void): Promise<BulkWriteOpResultObject>
    callback


Sends multiple insertOne, updateOne, updateMany, replaceOne, deleteOne, and / or deleteMany operations to the MongoDB server in one command.
This is faster than sending multiple independent operations(like) if you use create()) because with bulkWrite() there is only one round trip to MongoDB.
Mongoose will perform casting on all operations you provide.
This function does not trigger any middleware, not save() nor update().If you need to trigger save() middleware
for every document use create() instead.

@return — BulkWriteOpResult if the operation succeeds
  
  
  */
};