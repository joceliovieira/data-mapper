const express=require('express');
const bodyParser=require('body-parser');
const config=require('./config');

const app=express();
app.use(bodyParser.urlencoded());

const staticFiles=require('./controllers/static_files');
app.use('/',staticFiles);

app.listen(config.http.port,function(){
  console.log("Listening over port"+config.http.port);
});
