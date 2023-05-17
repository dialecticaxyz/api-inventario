const Datastore = require('nedb');
const use = new Datastore({filename:'./data/usuarios.dat', autoload: true});
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config.js');

async function createdAdminInit(req, rsp){///unique email
  use.count({}, function (err, count) {
    if(count==0){
      req.body["_id"] = req.body["user"]
      req.body["id"] = req.body["user"]
      req.body["time"] = Date.now()
      req.body["rol"] = "admin"
      bcrypt.genSalt(10).then((salt)=>{
        bcrypt.hash(req.body["password"], salt).then((paswCript)=>{
          req.body["password"] = paswCript
          use.insert(req.body, (err, record)=>{ 
            jwt.sign({"rol":"admin","id":req.body["_id"]},config.SECRET,{expiresIn:60*60*24}, (err,tkn)=>{
              rsp.status(200).send({"tkn":tkn,"nom":req.body["nom"],"user":req.body["user"],"rol":"admin","std":"success"})
            });
          })
        })
      })
    }else{
      rsp.status(200).send({"std":"exists"})
    }
  });
};
async function createdUse(req, rsp){///unique email
  req.body["_id"] = req.body["id"]
  req.body["time"] = Date.now()
  use.find({user: req.body["user"]}, (err, record)=>{
    if(record.length!=0){
      rsp.status(200).send("exists")
    }else{
      bcrypt.genSalt(10).then((salt)=>{
        bcrypt.hash(req.body["password"], salt).then((paswCript)=>{
          req.body["password"] = paswCript
          use.insert(req.body, (err, record)=>{ 
            rsp.status(200).send("created")
          })
        })
      })
    }
  });
};
function updateUser(req, resp){
  req.body["_id"] = req.body["id"]
  req.body["time"] = Date.now()
  use.find({"_id":req.body["_id"]}, (err, record)=> {
    if(record.length==0){
      resp.status(200).send("empty")
    }else{
      use.update({"_id":req.body["_id"]},{$set:req.body},{},()=>{
        resp.status(200).send("update")
      })
    }
  });
};
const updatePasword = async (req, res) => {
  const token = req.headers["x-access-token"];
  jwt.verify(token,config.SECRET, (err, decoded) => {
    if(err){
      req.status(200).send("error")
    }else{
      use.find({_id:decoded.id}, (err, record)=>{
        if(record.length!=0){
          let userData = record[0].user
          let password = record[0].password
          let user = req.body["user"]
          let pasAnt = req.body["pasAnt"]
          let newPas = req.body["newPas"]
          if(userData==user){
            bcrypt.compare(pasAnt, password, (err,rsl)=>{
              if(rsl){
                bcrypt.genSalt(10).then((salt)=>{
                  bcrypt.hash(newPas, salt).then((paswCript)=>{
                    use.update({ _id:decoded.id},{$set:{"password":paswCript,"time":Date.now()}},{},(err, num)=>{
                      if(num==1){ res.status(200).send("updatePasw") }
                    });
                  })
                })
              }else{ res.status(200).send("error de usuario o contraseña") }
            });
          }else{ res.status(200).send("error de usuario o contraseña") }
        }else{  res.status(200).send("empty") }
      });
    }
  });
} 
async function loginUser(req, rsp){
  use.find({user: req.body["user"]},(err,record)=>{
    if(record.length!=0){
      let d = record[0]
      const token = req.headers["x-access-token"];
      bcrypt.compare(token, d.password, (err,res)=>{
        if(res){
          jwt.sign({"rol":d.rol,"id":d.id},config.SECRET,{expiresIn:60*60*24},(err, tkn)=>{
            rsp.status(200).send({"tkn":tkn,"nom":d.nom,"user":d.user,"rol":d.rol,"std":"success"})
          });
        }else{
          rsp.status(200).send({std:"errorPsw"})
        }
      });
    }else{ rsp.status(200).send({std:"emptyUser"}) }
  });
};
function readUsers(req, resp) {
  use.find({}, function(err, record) {
    use.count({}, function (err, count) {
      resp.status(200).send({"record":record,"count":count})
    });
  });
};
function deleteUser(req, resp){
  use.remove({_id: req.body["_id"]},{}, function(err, remove) {
    if(remove==1){
      resp.status(200).send("delet")
    }else{
      resp.status(200).send("deletFail")
    }
  });
};
function countUsers(){
  return new Promise(function(resolve,reject){
    use.count({},(err,count)=>{ resolve(count) });
  })
}

module.exports = {
  createdUse,
  updateUser,
  loginUser,
  readUsers,
  deleteUser,
  countUsers,
  updatePasword,
  createdAdminInit
}
