const neo4j = require('neo4j-driver').v1;

module.exports=function(emmiter,config){

  const self=this;

  const _emmiter=emmiter;

  let _neo4j=null;
  try {
    if(config.neo4j.host.lastIndexOf('bolt://',0)!==0){
      config.neo4j.host='bolt://'.config.neo4j.host
    }

    if(config.neo4j.username && config.neo4j.password){
      _neo4j=neo4j.driver(config.neo4j.host,neo4j.auth.basic(config.neo4j.username,config.neo4j.password));
    } else {
      _neo4j=neo4j.driver(config.neo4j.host);
    }
  } catch(error) {
    console.error("Could not initialize neo4j connection: \n"+error.message);
  }


  /**
  * Insert a row of the excell-like data.
  * @param {Object} row The row that contains the data
  */
  self.insertFromExcellRow=function(row){

  }
}
