const JWT = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    //token missing ?????
    if (!token) {
      return res.status(401).send({
        success: true,
        message: "Token missing!",
      });
    }
    //verify token
    JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Unauthorized User",
          err,
        });
      } else {
        req.user = decoded;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Auth Middleware API",
      error,
    });
  }
};
module.exports = authMiddleware;
