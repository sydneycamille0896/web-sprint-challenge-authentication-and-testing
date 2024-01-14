const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../secrets/index')
//onst Users = require('../users/users-model')


module.exports = (req, res, next) => {
  //next();
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */


  const token = req.headers.authorization?.split(' ')[1]
  console.log('Received token:', token); // Log the token
  console.log('Headers:', req.headers); // Log all headers
  console.log(token)
  if(token){
    jwt.verify(token, JWT_SECRET, (err,decoded) => {
      if(err){
        next({status: 401, message: `token invalid`})
      } else {
        req.decodedJwt = decoded
        console.log('Restricted Middleware Decoded: ', decoded)
        next()
      }
    })
  } else {
    next({status: 401, message: `token required`})
  }
};
