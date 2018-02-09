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


//Edit This Settings
const httpConfig={
  // Http body size
  'body_size': '100mb',
  // Http listen port
  'port':9780,
  'socketio_url':null
};


const neo4jConfig={
  //Neo4j configuration
  'uri':'',
  'username':null,
  'password':null
}

const emailConfig={
  'user':null,
  'password':null,
  'email':''
}

// const mongoDbConfig={
//   'connection_string':"mongodb://localhost/mydb"
// }

const logs={
  'path':__dirname+'/../logs',
  'http_requests':'access.log',
  'errors':'app_errors.log'
}



//Config listen port
if(process.env.HTTP_PORT){
  httpConfig.port=process.env.HTTP_PORT;
}

//config socketio url
if(process.env.CLIENT_SOCKETIO_URL){

  //Assuming non https use https reverse proxy for that
  if(process.env.CLIENT_SOCKETIO_URL.lastIndexOf('ws://',0)!==0){
    httpConfig.socketio_url='ws://'+process.env.CLIENT_SOCKETIO_URL;
  } else {
    httpConfig.socketio_url=process.env.CLIENT_SOCKETIO_URL;
  }
} else {
  httpConfig.socketio_url='ws://0.0.0.0:'+httpConfig.port;
}



//Config Neo4j connection
if(process.env.NEO4J_HOST){
  if(process.env.NEO4J_HOST.lastIndexOf('bolt://',0)!==0){
    neo4jConfig.host='bolt://'+process.env.NEO4J_HOST;
  } else {
    neo4jConfig.host=process.env.NEO4J_HOST;
  }
}

if(process.env.NEO4J_USER){
  neo4jConfig.username=process.env.NEO4J_USER;
}

if(process.env.NEO4J_PASSWORD){
  neo4jConfig.password=process.env.NEO4J_PASSWORD;
}

//Logs Directory
const path = require('path');
const fs = require('fs');

if(process.env.LOGS_DIR){
  logs.path=process.env.LOGS_DIR
}

console.log("Autogenerating the logs path");
fs.mkdir(logs.path,'0666',function(e){
    if(!e || (e && e.code === 'EEXIST')){
        console.log('Log directory already exists skipping')
    } else {
        //debug
        console.error(e);
        system.exit(1);
    }
});

//MongoDb connection
// if(process.env.MONGO_CONNECTION_STRING){
//   mongoDbConfig.connection_string=process.env.MONGO_CONNECTION_STRING
// }

// DO NOT EDIT BELLOW THIS LINE

const excellFormat={
  'maxColumn':'R', //To get modified via developers according to the spedifications
  'columnMap':{
    'A':'dataId',
    'B':'dataAsset',
    'C':'dataSubject',
    'D':'categoryInfo',
    'E':'pIIclasification',
    'F':'source',
    'G':'collectedBy',
    'H':'collectionMethod',
    'I':'access',
    'J':'usedBy',
    'K':'purpoce',
    'L':'processingType',
    'M':'dataTranserMechanism',
    'N':'securityClassification',
    'O':'securityControl',
    'P':'storageOrData',
    'Q':'retentionPolicy',
    'R':'deletionPolicy'
  }
}

module.exports={
  'http':httpConfig,
  'neo4j':neo4jConfig,
  // 'mongoDb':mongoDbConfig,
  'logs':logs,
  'excell':excellFormat,
};
