const express=require('express');
const bodyParser=require('body-parser');
const config=require('./config');

const app=express();
app.use(bodyParser.urlencoded());

app.listen(config.http.port,function(){
  console.log("Listening over port"+config.http.port);
});
