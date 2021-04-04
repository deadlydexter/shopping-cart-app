var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');
var Order = require('../models/order');


/* GET home page. */
router.get('/', function (req, res, next) {
  var successMsg = req.flash('success')[0];
  var products = Product.find(function (err, docs) {
    var productChunks = [];
    var chunkSize = 6;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize))
    }
    res.render('shop/index', { title: 'Buy Cars | Welcome', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
  });
});

router.get('/add-to-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/reduce/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});


router.get('/increase/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.increaseByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});


router.get('/shopping-cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice })
})

router.get('/checkout', isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', { total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });
});


router.post('/checkout', isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  req.checkBody('name', 'Invalid Name').isLength({ min: 4 });
  req.checkBody('address', 'Invalid Address - Minimum lenght is 4').isLength({ min: 4 });
  req.checkBody('card_number', 'Card Number Must be integer').isInt();
  req.checkBody('card_number', 'Card Number Min Length is 4').isLength({ min: 4 });

  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function (error) {
      messages.push(error.msg);
    });
    res.render('shop/checkout', { total: cart.totalPrice, messages: messages, noError: !messages });
  } else {

    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name
    });
    order.save(function (err, result) {
      req.flash('success', 'Successfully bought product!');
      req.session.cart = null;
      res.redirect('/');
    });
  }
});

// For Testing Purposes ONLY
// GET ALL ORDERS
router.get('/test', async (req, res) => {
  try {
    const order = await Order.find();
    console.log(order.length)
    res.json(order);
  } catch (err) { res.json({ message: err }) }
});

// DELETE AN ORDER from Profile
router.delete('/test/:postId', async (req, res) => {
  try {
    const removedPost = await Order.deleteOne({ _id: req.params.postId });
    res.json(removedPost);
  } catch (err) { res.json({ message: err }) }
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}