const jwt = require('jsonwebtoken');
const env=require('dotenv')


env.config()

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email , name:user.name},
    process.env.JWT_SECRET,              
    { expiresIn: process.env.JWT_EXPIRES_IN } 
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET); 
};

module.exports = { generateToken, verifyToken };
