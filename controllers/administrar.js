const {LocalStorage} = require("node-localstorage");
const localStorage = new LocalStorage('./scratch');
let fs = require('fs');

function readNumNota(req, resp){
  let numNota = localStorage.getItem('numNota')
  resp.status(200).send(numNota)
};
function writeNumNota(req, resp){
  let numNota = req.body["numNota"]
  localStorage.setItem('numNota', parseInt(numNota))
  resp.send("write")
};

const readFile = (path) =>
  new Promise((resolve, reject) => {
    fs.stat("./data/"+path, (error, stats) => {
      if(error){ console.log(error); }
      else { resolve(stats.size) }
    });
  })
async function sizeDB(req,rsp){
  let inv = await readFile("inventario.dat")
  let use = await readFile("usuarios.dat")
  let ven = await readFile("ventas.dat")
  rsp.status(200).send({inv,use,ven})
}

module.exports = {
  sizeDB,
  readNumNota,
  writeNumNota
}