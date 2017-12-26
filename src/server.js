const express=require('express');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const session = require("express-session");
const passport = require("passport");

const config=require('./config');

const app=express();
app.use(bodyParser.urlencoded({extended:true,inflate:true}));
app.use(cookieParser());
app.use(session({ secret: 'w4takusHinamaEwa!2334pc_magasDesu',
    resave: true,
    saveUninitialized: true}
  ));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', __dirname + '/views');
app.set('view engine', 'twig');
app.set('twig options', {
    strict_variables: false
});



const staticFiles=require('./controllers/static_files');
app.use('/',staticFiles);


app.listen(config.http.port,function(){
  console.log("Listening over port: "+config.http.port);
});
