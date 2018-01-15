const express=require('express');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const session = require("express-session");
const csrf = require('csurf');

const passport = require("passport");
const EventEmitter = require('events');


const config=require('./config');

const app=express();

app.use(bodyParser.urlencoded({extended:true,inflate:true}));
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(session({ secret: 'w4takusHinamaEwa!2334pc_magasDesu',
    resave: true,
    saveUninitialized: true}
  ));

app.use(function (req, res, next){
  res.locals._csrf = req.csrfToken();
  next();
});

// app.use(passport.initialize());
// app.use(passport.session());


app.set('views', __dirname + '/views');
app.set('view engine', 'twig');
app.set('twig options', {
    strict_variables: false
});

const emmiter=new EventEmitter();


const staticFiles=require('./controllers/static_files');
app.use('/',staticFiles);

const user=require('./controllers/user');
app.use('/',user);

const PanelController=require('./controllers/panel');
const panelController=new PanelController(app,emmiter);

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
