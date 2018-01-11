const express=require('express');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const session = require("express-session");
const csrf = require('csurf');

const passport = require("passport");

const config=require('./config');

const app=express();
app.use(bodyParser.urlencoded({extended:true,inflate:true}));
app.use(cookieParser());
app.use(csrf({ cookie: true }));
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

const user=require('./controllers/user');
app.use('/',user);

const panel=require('./controllers/panel');
app.use('/',panel);

app.get('/',function(req,res,next){
  // if (req.user) {
      res.redirect('/panel');
  // } else {
  //     res.redirect('/login');
  // }
});

app.listen(config.http.port,function(){
  console.log("Listening over port: "+config.http.port);
});
