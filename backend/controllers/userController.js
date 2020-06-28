const User = require('../models/user');
const encryptor = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res, next) => {
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
        if(error.errors.email) {
          res.status(500).json({
            message: 'Account already exists! Try logging in!',
            result: null
          });
        }
      });
    }
  ).catch(() => {
    res.status(500).json({
      message: 'Account already exists!'
    });
  });
}

exports.loginUser = (req, res, next) => {
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
          message: "Password does not match!"
        });
      }
      const token = jwt.sign({email: user.email, userId: user._id}, "you_cant_fucking_hack_this_asshole", {expiresIn: '1h'});
      res.status(200).json({
        message: "Login Successful",
        token: token,
        expiresIn: 3600,
        userId: user._id
      });
    });
  }).catch(error => {
    return res.status(401).json({
      message: "Login Failed",
      token: null,
      expiresIn: null,
      userId: null
    });
  });
}
