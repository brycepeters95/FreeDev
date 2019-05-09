var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("../models/user");

// register
router.get("/register", function(req, res) {
  res.render("register");
});

// login
router.get("/login", function(req, res) {
  res.render("login");
});

// register user
router.post("/register", function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  var userUrl = req.body.userUrl;
  var language1 = req.body.language1;
  var language2 = req.body.language2;
  var language3 = req.body.language3;
  var project1 = req.body.project1;
  var project2 = req.body.project2;
  var project3 = req.body.project3;

  req.checkBody("name", "name is required").notEmpty();
  req.checkBody("email", "name is required").notEmpty();
  req.checkBody("username", "username is required").notEmpty();
  req.checkBody("email", "name is required").isEmail();
  req.checkBody("password", "password is required").notEmpty();
  req
    .checkBody("password2", "passwords do not match")
    .equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    res.render("register", {
      errors: errors
    });
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      userUrl: userUrl,
      language1: language1,
      language2: language2,
      language3: language3,
      project1: project1,
      project2: project2,
      project3: project3
    });

    User.createUser(newUser, function(err, user) {
      if (err) throw err;
      console.log(user);
    });
    //work pls

    req.flash("success_msg", "You are registered and can now login");
    //after registering
    res.redirect("/users/index");
  }
});
//matches username
passport.use(
  new LocalStrategy(function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) throww(err);
      if (!user) {
        return done(null, false, { message: "unknown user" });
      }

      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "invalid password" });
        }
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "users/login",
    failureFlash: true
  }),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect("/");
  }
);
router.get("/logout", function(req, res) {
  req.logout();

  req.flash("success_msg", "you are logged out");

  res.redirect("/users/login");
});

module.exports = router;
