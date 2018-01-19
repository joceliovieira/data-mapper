const neo4j = require('neo4j-driver').v1;
const moment = require('moment');

module.exports=function(emmiter,config){

  const self=this;

  const _emmiter=emmiter;

  let _neo4j=null;
  try {

    if(config.neo4j.username && config.neo4j.password){
      _neo4j=neo4j.driver(config.neo4j.host, neo4j.auth.basic(config.neo4j.username,config.neo4j.password));
    } else {
      _neo4j=neo4j.driver(config.neo4j.host);
    }
  } catch(error) {
    emmiter.emmit('neo4j_connection_error',error.message);
  }

  const generateUniqueLabel=function(prefix){
    return prefix+moment.utc().format(x);
  }

  /**
  * Insert a row of the excell-like data.
  * @param {Object} row The row that contains the data
  */
  self.insertFromExcellRow=function(row,callback){

      const session = _neo4j.session()
      const transaction= session.beginTransaction();

      const errorHandler=(error)=>{
        _emmiter.emit('insert_row_error',error);
        console.error(error);
        session.close();
        callback(error);
      }

      //The replacement of the values where it will get stored in neo4j
      const values={
        'dataid':row.dataId.trim(),
        'dataAsset':row.dataAsset.trim(),
        'purpoce':row.purpoce.trim(),
        'dataSubject':row.dataSubject.trim(),
        'source':row.source.trim(),
        'pIIclasification':row.pIIclasification.trim(),
        'securityClassification':row.securityClassification.trim(),
        'categoryInfo':row.categoryInfo.trim(),
        'appName':row.collectedBy.trim(),
        'securityControl':row.securityControl.trim(),
        'usedBy':row.usedBy.trim(),
        'whoCanAccess':row.access.trim(),
        'securityControl':row.securityControl.trim(),
        'dataTransferMechanism':row.dataTranserMechanism.trim(),
        'serviceName':row.collectedBy.trim(),
        'serverOrService':row.storageOrData.trim(),
        'processingType':row.processingType.trim(),
        'collectionMethod':row.collectionMethod.trim(),
      }



      let query=`MERGE (DATA_ASSET:DATA_ASSET {id:{dataid} ,name:{dataAsset}, subject:{dataSubject}, classification:{securityClassification}})
      MERGE (SERVER_OR_SERVICE:SERVER_OR_SERVICE { name: {serverOrService} })
      MERGE (APPLICATION:APPLICATION { name:{appName} })
      MERGE (DATA_CONSUMER:DATA_CONSUMER {usedBy: {usedBy}, accessOrgPositions: {whoCanAccess}})
      MERGE (PROSESED:PROSESED{ id:{dataid},type:{processingType},source:{source},pIIclasification:{pIIclasification},categoryInfo:{categoryInfo} })
      MERGE (DATA_CONSUMER)-[:ACCESSING]->(DATA_ASSET)
      MERGE (SERVER_OR_SERVICE)<-[:FROM]-(DATA_CONSUMER)
      MERGE (DATA_ASSET)-[:COLLECTED_BY { method: {collectionMethod}, purpoce:{purpoce} }]->(APPLICATION)
      MERGE (DATA_ASSET)-[:GETS]->(PROSESED)
      MERGE (PROSESED)-[:FROM]->(APPLICATION)
      MERGE (PROSESED)-[:INTO { transferMechanism:{dataTransferMechanism}, securityControl:{securityControl}}]->(SERVER_OR_SERVICE)
      `;

      transaction.run(query,values).then((data)=>{
          transaction.commit().then((data)=>{
              console.log('Success');
              session.close();
              callback(null);
          }).catch(errorHandler);
      }).catch(errorHandler);
  }

  /**
  * Method that retrieves the data into a table view.
  * @param {Int} page The pegination index.
  * @param {Int} limit The pagination limit.
  * @param {Fuction} callback
  */
  self.fetchDataAsTable=function(page,limit,callback) {
    const session = _neo4j.session();

    /**
    MATCH (D:DATA_ASSET)-[:GETS]->(PROSESSED:PROSESED)-[INTO:INTO]->(SERVER_OR_SERVICE:SERVER_OR_SERVICE)<-[:FROM]-(DC:DATA_CONSUMER)-[:ACCESSING]->(D2:DATA_ASSET)-[COLLECTED_BY:COLLECTED_BY]->(APPLICATION:APPLICATION)<-[:FROM]-(PROSESSED2:PROSESED)
WHERE D.id=D2.id AND PROSESSED2.id=PROSESSED.id AND D.id=PROSESSED.id AND D2.id=PROSESSED2.id
RETURN D.id, D.name,D.subject,PROSESSED.pIIclasification,PROSESSED.source,
APPLICATION.name,DC.accessOrgPositions,DC.usedBy,PROSESSED.purpoce,
D.classification,PROSESSED.type,PROSESSED.categoryInfo,
INTO.transferMechanism,INTO.securityControl,
SERVER_OR_SERVICE.name
    */

    let fetchQuery="MATCH (d:DATA_ASSET {id:'0001'}) RETURN d.id";

    session.run(fetchQuery).then((data)=>{
      console.log("Fetched Data: ")
      console.log(data.records);
    });
  };

}
