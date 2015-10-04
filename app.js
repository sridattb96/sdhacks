var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , session = require('express-session')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , morgan = require('morgan')
  , methodOverride = require('method-override')
  , SliceStrategy = require('passport-slice').Strategy
  , mongoose = require('mongoose')
  , request = require('request')
  , moment = require('moment');

var url; 
var cb;
if (process.env.NODE_ENV === 'development') {
  url = 'mongodb://localhost/sdhacks';
  cb = 'http://localhost:3000/auth/slice/callback';
} else if (process.env.NODE_ENV === 'production') {
  url = process.env.MONGOLAB_URI;
  cb = 'http://sdhacks2015.herokuapp.com/auth/slice/callback';
}

var db = mongoose.connect(url);
var orders; 
var auth;

var myUserId; 

require('./models/item');
require('./models/notification');
require('./models/user');


var Item = mongoose.model('Item'),
    Notification = mongoose.model('Notification');
    User = mongoose.model('User');

var SLICE_CLIENT_ID = "8ee96e75"
var SLICE_CLIENT_SECRET = "5382c68434f72e0a62702e1df2a093f5";

var app = express();

// configure Express
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(morgan('combined', {skip: function (req, res) {return res.statusCode < 400}}));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true}));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/public'));

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete Slice profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the SliceStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Slice
//   profile), and invoke a callback with a user object.
passport.use(new SliceStrategy({
    clientID: SLICE_CLIENT_ID,
    clientSecret: SLICE_CLIENT_SECRET,
    callbackURL: cb
  },
  function(accessToken, refreshToken, profile, done) {
    auth = "Bearer " + accessToken; 
    console.log("AUTHORIZATION = " + auth);
    // console.log(auth);
    process.nextTick(function () {
      request({
          url: 'https://api.slice.com/api/v1/orders', //URL to hit
          // qs: {from: 'blog example', time: +new Date()}, //Query string data
          method: 'GET', //Specify the method
          headers: { //We can define headers too
              'Authorization' : auth
          }
      }, function(error, response, body){
          if(error) {
            console.log(error);
          } else {
            orders = JSON.parse(body); 

            User.count(function (err, count) {
                if (!err && count === 0) {
                  User.create({
                    mostExpName: null,
                    mostExpPrice: null,
                    books: {
                      avgTime: null,
                      lastPurchasedDate: null
                    },
                    toys: {
                      avgTime: null,
                      lastPurchasedDate: null
                    },
                    electronics: {
                      avgTime: null,
                      lastPurchasedDate: null
                    },
                    payments: {
                      avgTime: null,
                      lastPurchasedDate: null
                    },
                    music: {
                      avgTime: null,
                      lastPurchasedDate: null
                    },
                    travel: {
                      avgTime: null,
                      lastPurchasedDate: null
                    },
                  }, function(err, obj){
                    myUserId = obj._id;
                  })
                }
            });
          }
      });
      
      // To keep the example simple, the user's Slice profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the Slice account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/orders', function(req, res) {
  Item.find({}, function(err, items) {
    res.json(items);
  })
  // var j = JSON.parse('{"currentTime":1443945578000,"result":[{"updateTime":1443900446000,"orderNumber":"WWRG-714577","orderTitle":"","orderDate":"2015-09-30","orderTax":0,"shippingCost":800,"orderTotal":2950,"purchaseType":{"name":"Shippable Purchase","href":"https://api.slice.com/api/v1/purchasetypes/2"},"merchant":{"hidden":false,"href":"https://api.slice.com/api/v1/merchants/104913"},"mailbox":{"href":"https://api.slice.com/api/v1/mailboxes/-5035517678949188930"},"items":[{"href":"https://api.slice.com/api/v1/items/8825320504685508561"}],"shipments":[],"orderEmails":[{"href":"https://api.slice.com/api/v1/emails/-2744358439782971816"}],"shipmentEmails":[],"attributes":[],"href":"https://api.slice.com/api/v1/orders/-5423354854282239345"},{"updateTime":1443900459000,"orderNumber":"20-47486/NCA","orderTitle":"","orderDate":"2015-07-18","orderTax":0,"shippingCost":0,"orderTotal":0,"purchaseType":{"name":"Shippable Purchase","href":"https://api.slice.com/api/v1/purchasetypes/2"},"merchant":{"hidden":false,"href":"https://api.slice.com/api/v1/merchants/13"},"mailbox":{"href":"https://api.slice.com/api/v1/mailboxes/-5035517678949188930"},"items":[{"href":"https://api.slice.com/api/v1/items/-1286170951846858922"}],"shipments":[{"href":"https://api.slice.com/api/v1/shipments/2917934367052764465"}],"orderEmails":[{"href":"https://api.slice.com/api/v1/emails/-549732122993425930"}],"shipmentEmails":[{"href":"https://api.slice.com/api/v1/emails/-3115291614562854745"}],"attributes":[],"href":"https://api.slice.com/api/v1/orders/6214947023161511848"},{"updateTime":1443900454000,"orderNumber":"111-8979626-3093814","orderTitle":"","orderDate":"2014-10-31","orderTax":0,"shippingCost":0,"orderTotal":0,"purchaseType":{"name":"Shippable Purchase","href":"https://api.slice.com/api/v1/purchasetypes/2"},"merchant":{"hidden":false,"href":"https://api.slice.com/api/v1/merchants/1"},"mailbox":{"href":"https://api.slice.com/api/v1/mailboxes/-5035517678949188930"},"items":[{"href":"https://api.slice.com/api/v1/items/807488140574327793"},{"href":"https://api.slice.com/api/v1/items/-1611323039806152719"}],"shipments":[{"href":"https://api.slice.com/api/v1/shipments/8468805107214919429"}],"orderEmails":[],"shipmentEmails":[{"href":"https://api.slice.com/api/v1/emails/5947302459353644415"}],"attributes":[],"href":"https://api.slice.com/api/v1/orders/971490600264586275"},{"updateTime":1443900461000,"orderNumber":"1664-2811-8719-2159","orderTitle":"","orderDate":"2013-03-20","orderTax":0,"shippingCost":0,"orderTotal":100,"purchaseType":{"name":"Payment","href":"https://api.slice.com/api/v1/purchasetypes/3"},"merchant":{"hidden":false,"href":"https://api.slice.com/api/v1/merchants/58"},"mailbox":{"href":"https://api.slice.com/api/v1/mailboxes/-5035517678949188930"},"items":[{"href":"https://api.slice.com/api/v1/items/-164636839841946475"}],"shipments":[],"orderEmails":[{"href":"https://api.slice.com/api/v1/emails/7166300581912913232"}],"shipmentEmails":[],"attributes":[],"href":"https://api.slice.com/api/v1/orders/7380408207138564003"}]}');
  // res.json(j)
})

app.get('/slice', function(req, res) {
  if (!req.user) {
    res.render('index');
  }

  res.json(orders);

  // var j = JSON.parse(orders);
  // //res.json(j);

  // //processing this json for all the conditions
  // //console.log(j)
  // var data = j.result;
  // var overSpent = [];
  // var message = null

  // for (var i = 0; i < data.length; i++) {
  //   if (data[i].orderTotal > 1000) {
  //     overSpent.push(data[i].orderNumber);
  //   }
  // }

  // if (overSpent.length > 0) {
  //   message = "Do you really gotta spend that much bruh? Here were your orders over 1000:"
  // }

  // var obj = { mess: message, orderNums: overSpent }

  // res.json(obj)
})

app.get('/refresh', function(req, res) {

  var message = "Refreshed!"

  var curr;
  curr = moment().format('1995-11-11', 'YYYY-MM-DD');
  if (process.env.LAST_UPDATE != null) {
    curr = moment().format(process.env.LAST_UPDATE, 'YYYY-MM-DD');
  }
  else {
    curr = moment().format('1995-11-11', 'YYYY-MM-DD');
  }
  var temp = orders.result;
  var userDefaults;

  // User.find({}, function(err, data){
  //   if (data) {
  //     userDefaults = data[0];
  //   }
  // })

  temp.forEach(function(order) {
    var dt = moment().format(order.orderDate, 'YYYY-MM-DD');

    if (dt > curr) {
      
      var merchant;
      var name;
      var category;

      request({
          url: order.merchant.href, 
          method: 'GET', 
          headers: { 
              'Authorization' : auth
          }
      }, function(error, response, body){
          if(error) {
              console.log(error);
          } else {

            merchant = JSON.parse(body).result.name; 
            request({
                url: order.items[0].href, 
                method: 'GET', 
                headers: { 
                    'Authorization' : auth
                }
            }, function(error, response, item){
                if(error) {
                    console.log(error);
                } else {
                  var j = JSON.parse(item);
                  name = j.result.description;

                  category = j.result.category.name;
                  Item.create({
                    name : name, 
                    merchant : merchant,
                    category : category,
                    price : order.orderTotal,
                    time : order.orderDate
                  }, function(err, item) {


                  });

                  User.find({}, function(err, obj){

                      //ALGORITHM - FIND MOST EXPENSIVE
                      var mostExpName = obj[0].mostExpName;
                      var mostExpPrice = obj[0].mostExpPrice;

                      if (mostExpName == null) {
                        User.update({}, {
                          mostExpName: name,
                          mostExpPrice: order.orderTotal
                        }, function(err, obj){
                        })
                      }

                      if (mostExpPrice && mostExpPrice < order.orderTotal) {
                        var diff = order.orderTotal - mostExpPrice;
                        message = name + " is the most expensive thing you've bought, beating out " + mostExpName + " by $" + diff; 
                        //push message to notifications collection

                        User.update({}, {
                          mostExpName: name,
                          mostExpPrice: order.orderTotal
                        }, function(err, obj){

                        })

                      }

                      // var db = [];

                      // if (db.length == 2) {
                      //   avgTime = db[1].bought - lastPurchasedDate;
                      // }
                      
                      // else if (db.length > 2 && db.length <= 5) {
                      //   avgTime = (avgTime*(db.length-1) + obj.bought - lastPurchasedDate)/(db.length);
                      // }

                      // else if (db.length > 5) {
                      //   if (obj.bought - lastPurchasedDate > avgTime * 3) {
                      //     alert("it's been a while since you've gotten " + obj.name)
                      //   }
                        
                      //   avgTime = (avgTime*(db.length-1) + obj.bought - lastPurchasedDate)/(db.length);
                      // }
                      
                      // lastPurchasedDate = obj.bought






                  })
                                    
                }
            });
          }
      });}
  });

  Item.findOne({}).sort('-time').exec(function(err, max) {
    process.env['LAST_UPDATE'] = max;
  })

  res.redirect('/orders');
});



// GET /auth/slice
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in Slicd authentication will involve redirecting
//   the user to slice.com. After authorization, Slice will redirect the user
//   back to this application at /auth/slice/callback
app.get('/auth/slice',
  passport.authenticate('slice'),
  function(req, res){
    // The request will be redirected to Slice for authentication, so this
    // function will not be called.
  });

// GET /auth/slice/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/slice/callback', 
  passport.authenticate('slice', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/account');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'));


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected. If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}
