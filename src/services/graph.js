const neo4j = require('neo4j-driver').v1;
const moment = require('moment');
const _ = require('underscore');

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
  self.insertFromExcellRow=function(row,labels,callback){

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

      /**
      *  Keeping the labels in jsonencoded strings
      *  I do that because I want to pass the information over the frontend
      *  for each node seperately in order to have a self-contained info display mechanism
      */
      values.dataAssetLabels=JSON.stringify({
        'id':labels.dataId.trim(),
        'asset_name':labels.dataAsset.trim(),
        'subject':labels.dataSubject.trim(),
        'classification':labels.securityClassification.trim(),
        'categoryInfo':labels.categoryInfo.trim()
      });

      values.serverOrServiceLabels=JSON.stringify({
        'name': labels.storageOrData.trim()
      });

      values.applicationLabels=JSON.stringify({
        'name':labels.collectedBy.trim()
      });

      values.dataConsumerLabels=JSON.stringify({
        'usedBy':labels.usedBy.trim(),
        'accessOrgPositions':labels.access.trim()
      });

      values.prosessedLabels=JSON.stringify({
        'type':labels.processingType.trim(),
        'source':labels.source.trim(),
      });


      values.collectedByLabels=JSON.stringify({
        'method':labels.collectionMethod.trim(),
        'purpoce':labels.purpoce.trim()
      });

      values.intoLabels=JSON.stringify({
        'transferMechanism':labels.dataTranserMechanism.trim(),
        'securityControl':labels.securityControl.trim()
      })

      //The query itself that will be executed over the Neo4j Server
      let query=`MERGE (DATA_ASSET:DATA_ASSET { id:{dataid} , asset_name:{dataAsset}, subject:{dataSubject}, classification:{securityClassification},  categoryInfo:{categoryInfo}, labels:{dataAssetLabels} })
      MERGE (SERVER_OR_SERVICE:SERVER_OR_SERVICE { name: {serverOrService}, labels:{serverOrServiceLabels} })
      MERGE (APPLICATION:APPLICATION { name:{appName}, labels: {applicationLabels} })
      MERGE (DATA_CONSUMER:DATA_CONSUMER { usedBy: {usedBy}, accessOrgPositions: {whoCanAccess}, labels: {dataConsumerLabels} })
      MERGE (PROSESED:PROSESED { type:{processingType}, source:{source},pIIclasification:{pIIclasification}, labels: {prosessedLabels} })
      MERGE (DATA_CONSUMER)-[:ACCESSING]->(DATA_ASSET)
      MERGE (SERVER_OR_SERVICE)<-[:FROM]-(DATA_CONSUMER)
      MERGE (DATA_ASSET)-[:COLLECTED_BY { method: {collectionMethod}, purpoce:{purpoce}, labels: {collectedByLabels} }]->(APPLICATION)
      MERGE (DATA_ASSET)-[:GETS]->(PROSESED)
      MERGE (PROSESED)-[:FROM]->(APPLICATION)
      MERGE (PROSESED)-[:INTO { data_id:{dataid}, transferMechanism:{dataTransferMechanism}, securityControl:{securityControl}, labels:{intoLabels} }]->(SERVER_OR_SERVICE)`;


      transaction.run(query,values).then((data)=>{
          transaction.commit().then((data)=>{
              session.close();
              callback(null);
          }).catch(errorHandler);
      }).catch(errorHandler);
  }

  /**
  * Get the graph in a formm that is renderable with Alchemy.js
  * @param {Function} callback The callback that returns the data or an error
  */
  self.fetchDataAsGraph=function(callback){

    const session = _neo4j.session();

    const return_data={
      nodes:[],
      edges:[]
    };


    session.run("MATCH (p) RETURN p").then( (data) =>{
      //get the session data
      return_data.nodes=_.map(data.records,(obj)=>{
        const value={
          id:obj._fields[0].identity.low,
          properties:obj._fields[0].properties,
          type: obj._fields[0].labels[0],
        };

        return value;
      });

      return session.run('MATCH (p1)-[n]->(p2) return n').then((relationship_data)=>{
        return_data.edges=_.map(relationship_data.records, (obj) => {
          const value ={
            id:obj._fields[0].identity.low,
            type:obj._fields[0].type,
            source: obj._fields[0].start.low,
            target: obj._fields[0].end.low,
            properties:obj._fields[0].properties
          };
          return value;
        });
        callback(null,return_data)
        session.close();
      }).catch((error)=>{
        callback(error);
      });
    }).catch((error)=>{
      callback(error);
    })

  }

}
