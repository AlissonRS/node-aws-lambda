const passport = require("passport");
const  BearerStrategy = require("passport-http-bearer").Strategy;
const  CookieStrategy = require("passport-cookie").Strategy;
const jwt = require('jsonwebtoken');
const secretKey = require('./secretKey');

passport.use(new CookieStrategy(
  function(token, done) {
    jwt.verify(token, secretKey(), function(err, decoded) {
      if (err) {
        return done(err);
      }
      return done(null, decoded, { scope: "all" });
    });
  }
));

passport.use(
  new BearerStrategy(function(token, done) {
    jwt.verify(token, secretKey(), function(err, decoded) {
      if (err) {
        return done(err);
      }
      return done(null, decoded, { scope: "all" });
    });
  })
);
