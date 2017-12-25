const config={
  'http':{
    // Http body size
    'body_size': '100mb',
    // Http listen port
    'port':9780,
  },
  'neo4j':{
    //Neo4j configuration
  },
  'email':{
    //Email configuration
  },
  'mongodb':{
    //Mongodb configuration
  }
}


if(process.env.HTTP_PORT){
  config.http.port=process.env.HTTP_PORT
}


module.exports=config;
