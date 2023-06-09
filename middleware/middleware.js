const jwt = require('jsonwebtoken');
const config = require('../config.js');

async function verifyUser(req, res, next) {
  const token = req.headers["x-access-token"];
  if(!token) {
    return res.status(401).send({message:"No Token aws Provided"});
  }
  jwt.verify(token, config.SECRET, (err, decoded) => {
    if(err){
      return res.status(401).send({message:"No Token aws Autorised"});
    }else{
      return  next();
    }
  });
}
async function verifyAdmin(req, res, next) {
  const token = req.headers["x-access-token"];
  if(!token) {
    return res.status(401).send({message:"No Token aws Provided"});
  }
  jwt.verify(token, config.SECRET, (err, decoded) => {
    if(err){
      return res.status(401).send({message:"No Token aws Autorised"});
    }else{
      if(decoded.rol=="admin"){
        return  next();
      }else{
        return res.status(401).send({message:"No Autorised"});
      }
    }
  });
}
async function verifyAdminAlma(req, res, next) {
  const token = req.headers["x-access-token"];
  if(!token) {
    return res.status(401).send({message:"No Token aws Provided"});
  }
  jwt.verify(token, config.SECRET, (err, decoded) => {
    if(err){
      return res.status(401).send({message:"No Token aws Autorised"});
    }else{
      if(decoded.rol=="admin"||decoded.rol=="alma"){
        return  next();
      }else{
        return res.status(401).send({message:"No Autorised"});
      }
    }
  });
}
module.exports = { 
  verifyUser:verifyUser,
  verifyAdmin:verifyAdmin,
  verifyAdminAlma:verifyAdminAlma
}