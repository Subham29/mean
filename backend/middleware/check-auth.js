const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authentication.split(" ")[1];
    const decodedData = jwt.verify(token ,"you_cant_fucking_hack_this_asshole");
    req.userData = {email: decodedData.email, userId: decodedData.userId};
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Authentication Failed!'
    });
  }
};
