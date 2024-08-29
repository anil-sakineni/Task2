const jwt = require('jsonwebtoken');
const env=require('dotenv')


env.config()

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email , name:user.name , age:user.age , phone:user.phone},
    process.env.JWT_SECRET
  );
};
 
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET); 
}; 
   
module.exports = { generateToken, verifyToken };
