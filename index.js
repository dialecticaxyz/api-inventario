const cors = require('cors')
const path = require('path');
const express = require('express');
const app = express();
const wsServer = require('express-ws')(app); 
const config = require('./config');
const router = require('./routes/routes.js');
const hbs = require('hbs');

let clients = new Array;
function handleWs(ws, request) {
  console.log("New Connection");        
  clients.push(ws);
  function endClient(){
    var position = clients.indexOf(ws);
    clients.splice(position, 1);
    console.log("connection closed");
  } 
  function clientResponse(data){
    for (let c in clients) { 
      if(!(clients[c]==ws)){
        clients[c].send(data);
      }
    }
  }
  ws.on('message', clientResponse);
  ws.on('close', endClient);
}

const port = process.env.PORT || 80
app.set('view engine', 'hbs');
app.set("views", __dirname + "/views");
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false
}
app.use(express.static('public', options))
app.use(cors())
app.use(express.json()); 
app.use('/', router);
app.ws('/', handleWs);

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})