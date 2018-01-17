const neo4j = require('neo4j-driver').v1;

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
  */
  self.insertFromExcellRow=function(row,rowNum){

      const session = _neo4j.session();

      //The replacement of the values where it will get stored in neo4j
      const values={
        'dataid':row.dataId,
        'dataAsset':row.dataAsset,
        'dataSubject':row.dataSubject,
        'clasification':row.clasification,
        'purpoce':row.purpoce,
        'source':row.source,
        'pIIclasification':row.pIIclasification,
        'categoryInfo':row.categoryInfo,
        'appName':row.collectedBy,
        'securityControl':row.securityControl,
        'usedBy':row.usedBy,
        'whoCanAccess':row.access,
        'securityControl':row.securityControl,
        'dataTransferMechanism':row.dataTranserMechanism,
        'serviceName':row.collectedBy,
        'rowNum':rowNum
      }
      console.log(row.dataTranserMechanism);
      //Inserting the most of the relationships
      let graphGenerationQuery='MERGE ({serviceName}:SERVER_OR_SERVICE { name: {serviceName} })<-[{dataid}:FROM]-( {usedBy}:DATA_CONSUMER {usedBy: {usedBy}, accessOrgPositions: {whoCanAccess}  } )-[:Accessing]->({dataid}:DATA_ASSET { id:{dataId} ,name:{dataAsset}, subject:{dataSubject}, classification:{clasification}  })-[:GETTING]->';

      //Relationship between Processing and application
      let transmissionStorageServerRelationshipQuery='MERGE ';

      let applicationDataAssetTransmissionSDotrageRelationship='MERGE ({dataId}:DATA_ASSET)-{:COLLECTED_BY}->({appName}:APPLICATION)';

      if(row.processingType.toLowerCase()==='transmission'){
        graphGenerationQuery+='({rowNum}:TRANSMITTED { purpoce:{purpoce},source:{source},pIIclasification:{pIIclasification},categoryInfo:{categoryInfo} })';
        transmissionStorageServerRelationshipQuery+='({dataId}:TRANSMITTED)-[:INTO { transferMechanism:{dataTransferMechanism}, securityControl:{securityControl}}]->({serviceName}:SERVER_OR_SERVICE)';
      } else if(row.processingType.toLowerCase()==='storage'){
        graphGenerationQuery+='({rowNum}:STORED { purpoce:{purpoce}, source:{source} , pIIclasification:{pIIclasification} , categoryInfo:{categoryInfo} })';
        transmissionStorageServerRelationshipQuery+='(:STORED)-[:INTO { transferMechanism:{dataTransferMechanism}, securityControl:{securityControl}}]->({serviceName}:SERVER_OR_SERVICE)';
      }

      graphGenerationQuery+='-[:FROM]->({appName}:APPLICATION { name:{appName} })';
      graphGenerationQuery=graphGenerationQuery.replace(/\s/g, '');
      graphGenerationQuery+=' '+applicationDataAssetTransmissionSDotrageRelationship.replace(/\s/g, '')+' '+transmissionStorageServerRelationshipQuery.replace(/\s/g, '');

      session.run(graphGenerationQuery,values).then((data)=>{
        _emmiter.emit('inserted_row',rowNum);
        session.close();
      }).catch((error)=>{
        _emmiter.emit('insert_row_error',error);
        console.error(error);
      });
  }
}
