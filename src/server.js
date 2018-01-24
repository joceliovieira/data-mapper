/**
FLOW-D a GDPR data flow mapping tool
Copyright (C) 2018 Desyllas Dimitrios

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const express=require('express');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const session = require("express-session");
const csrf = require('csurf');
const twig = require("twig");
const io = require('socket.io');

// const passport = require("passport");
const EventEmitter = require('events');


const config = require('./config');
const Graph = require('./services/graph');
const Excell = require('./services/excell');

/*Generating Services*/
const app=express();
const server=app.listen(config.http.port,function(){
  console.log("Listening over port: "+config.http.port);
});
const websocket=io.listen(server);


const emmiter=new EventEmitter();

twig.extendFunction('websockerUrl',function(){
  return config.http.socketio_url;
});

//Handle Neo4j connection error
emmiter.on('neo4j_connection_error',(message)=>{
  console.error('Neo4j cannot connect');
  console.error(message);
  process.exit(1);
});

// emmiter.on('mongodb_connection_error',(message)=>{
//   console.error('Mongodb cannot connect');
//   console.error(message);
//   process.exit(1);
// });

const excellReader = new Excell(config,emmiter);
const graphMaker = new Graph(emmiter,config);


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


const staticFiles=require('./controllers/static_files');
app.use('/',staticFiles);

const user=require('./controllers/user');
app.use('/',user);

const PanelController=require('./controllers/panel');
const panelController=new PanelController(app,emmiter,websocket,excellReader,graphMaker);

app.get('/',function(req,res,next){
  // if (req.user) {
      res.redirect('/panel');
  // } else {
  //     res.redirect('/login');
  // }
});
