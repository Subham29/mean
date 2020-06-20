const User = require('../models/user');
const express = require('express');
const router = express.Router();
const encryptor = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post("/signup", (req, res, next) => {
  encryptor.hash(req.body.password, 10).then(
    encryptedPassword => {
      const newUser = new User({
        email: req.body.email,
        password: encryptedPassword
      });
      newUser.save().then(result => {
        console.log("User added");
        res.status(201).json({
          message: 'User Created!',
          result: result
        });
      }).catch(error => {
        res.status(500).json({
          message: error,
          result: null
        });
      });
    }
  );
});

router.post("/login", (req, res, next) => {
  User.findOne({email: req.body.email})
  .then(user => {
    if(!user) {
      return res.status(401).json({
        message: "Login Failed"
      });
    }
    encryptor.compare(req.body.password, user.password).then(isSame => {
      if (!isSame) {
        return res.status(401).json({
          message: "Login Failed"
        });
      }
      const token = jwt.sign({email: user.email, userId: user._id}, "you_cant_fucking_hack_this_asshole", {expiresIn: '1h'});
      res.status(200).json({
        token: token,
        expiresIn: 3600
      });
    });
  }).catch(error => {
    return res.status(401).json({
      message: "Login Failed"
    });
  });
});

module.exports = router;
