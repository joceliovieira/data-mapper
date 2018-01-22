const neo4j = require('neo4j-driver').v1;
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


  /**
  * Insert a row of the excell-like data.
  * @param {Object} row The row that contains the data
  * @param {Object} labels What it will get displayed for each row and each node
  * @param {Integer} maxRows How many rows the uploaded excell contains
  * @param {Integer} rowNum The number/order/increasing number of the currently read row
  * @param {Object} version The version information
  */
  self.insertFromExcellRow=function(row,labels,maxRows,rowNum,version,callback){

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

      //Merging version information with replacement strings
      Object.assign(values,version);

      values.rowData=JSON.stringify(row);
      values.rowNum=neo4j.int(rowNum);
      values.totalRows=neo4j.int(maxRows);

      console.log(values)

      //The query itself that will be executed over the Neo4j Server
      let query=` MERGE (UPLOAD_PROCESS:UPLOAD_PROCESS {version_name:{version_name}, date_unix:{date_unix}, date:{date}, totalRows: {totalRows} })
      MERGE (ROW:ROW { upload_version_name:{version_name}, row_num: {rowNum}, rowData:{rowData} })
      MERGE (DATA_ASSET:DATA_ASSET { version_name:{version_name}, id:{dataid} , asset_name:{dataAsset}, subject:{dataSubject}, classification:{securityClassification},  categoryInfo:{categoryInfo}, labels:{dataAssetLabels} })
      MERGE (SERVER_OR_SERVICE:SERVER_OR_SERVICE { version_name:{version_name}, name: {serverOrService}, labels:{serverOrServiceLabels} })
      MERGE (APPLICATION:APPLICATION { version_name:{version_name}, name:{appName}, labels: {applicationLabels} })
      MERGE (DATA_CONSUMER:DATA_CONSUMER { version_name:{version_name}, usedBy: {usedBy}, accessOrgPositions: {whoCanAccess}, labels: {dataConsumerLabels} })
      MERGE (PROSESED:PROSESED { version_name:{version_name}, type:{processingType}, source:{source},pIIclasification:{pIIclasification}, labels: {prosessedLabels} })
      MERGE (DATA_CONSUMER)-[:ACCESSING]->(DATA_ASSET)
      MERGE (SERVER_OR_SERVICE)<-[:FROM]-(DATA_CONSUMER)
      MERGE (DATA_ASSET)-[:COLLECTED_BY { version_name:{version_name}, method: {collectionMethod}, purpoce:{purpoce}, labels: {collectedByLabels} }]->(APPLICATION)
      MERGE (DATA_ASSET)-[:GETS]->(PROSESED)
      MERGE (PROSESED)-[:FROM]->(APPLICATION)
      MERGE (PROSESED)-[:INTO { version_name:{version_name}, data_id:{dataid}, transferMechanism:{dataTransferMechanism}, securityControl:{securityControl}, labels:{intoLabels} }]->(SERVER_OR_SERVICE)
      MERGE (DATA_ASSET)<-[:HAS]-(UPLOAD_PROCESS)
      MERGE (SERVER_OR_SERVICE)<-[:HAS]-(UPLOAD_PROCESS)
      MERGE (APPLICATION)<-[:HAS]-(UPLOAD_PROCESS)
      MERGE (DATA_CONSUMER)<-[:HAS]-(UPLOAD_PROCESS)
      MERGE (PROSESED)<-[:HAS]-(UPLOAD_PROCESS)
      MERGE (UPLOAD_PROCESS)-[:HAS]->(ROW)`;


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
  self.fetchDataAsGraph=function(version,callback){

    if(!version){
      return callback(new Error('Please select a version'));
    }

    const session = _neo4j.session();

    const return_data={
      nodes:[],
      edges:[]
    };

    const params={
      'version':version
    }

    /**
    * Fetch All links from a graph
    */
    const fetchAllLinks= () => {
      const query=`MATCH (UPLOAD_PROCESS:UPLOAD_PROCESS {version_name:{version}})-[:HAS]->(p1)-[n:ACCESSING|FROM|COLLECTED_BY|GETS|INTO]->(p2)<-[:HAS]-(UPLOAD_PROCESS)
      WHERE labels(p1)[0] IN ['DATA_ASSET','SERVER_OR_SERVICE','APPLICATION','DATA_CONSUMER','PROSESED'] AND
      labels(p2)[0] IN ['DATA_ASSET','SERVER_OR_SERVICE','APPLICATION','DATA_CONSUMER','PROSESED']
      return n`
      return session.run(query,params).then((relationship_data)=>{
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
    }

    const query=`MATCH (UPLOAD_PROCESS:UPLOAD_PROCESS {version_name:{version}})-[:HAS]->(p)
     WHERE labels(p)[0] IN ['DATA_ASSET','SERVER_OR_SERVICE','APPLICATION','DATA_CONSUMER','PROSESED']
     RETURN p`;
    session.run(query,params).then( (data) =>{
      //get the session data
      return_data.nodes=_.map(data.records,(obj)=>{
        const value={
          id:obj._fields[0].identity.low,
          properties:obj._fields[0].properties,
          type: obj._fields[0].labels[0],
        };

        return value;
      });

      return fetchAllLinks();
    }).catch((error)=>{
      callback(error);
    })
  }

  /**
  * Listing all versions
  * @param {String} name The name of the version
  * @param {Function} callback In order to return any errors or results
  */
  self.getVersionList=function(version,callback){
    const session = _neo4j.session();

    let query=null;
    if(version){
      query=`MATCH (UPLOAD_PROCESS:UPLOAD_PROCESS {version_name:{version}}) return UPLOAD_PROCESS`
    } else {
      //When no version we want to limit the results into a specific results
      query=`MATCH (UPLOAD_PROCESS:UPLOAD_PROCESS) return UPLOAD_PROCESS ORDER BY UPLOAD_PROCESS.unix_time DESC LIMIT 10`
    }

    session.run(query,{'version':version}).then((data)=>{
      const return_data=_.map(data.records,(obj)=>{
        const properties=obj._fields[0].properties;
        return {
          'name':properties.version_name,
          'date_unix':properties.date_unix
        };
      });
      callback(null,return_data);
    }).catch((error)=>{
      console.error(error);
      callback(error);
    })
  }

}
