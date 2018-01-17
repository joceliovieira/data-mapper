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
        'purpoce':row.purpoce,
        'source':row.source,
        'pIIclasification':row.pIIclasification,
        'securityClassification':row.securityClassification,
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
      console.log(values.serviceName);
      //Inserting the most of the relationships
      let graphGenerationQuery='MERGE (:SERVER_OR_SERVICE { name: {serviceName} })<-[:FROM {dataid:{dataid}}]-(:DATA_CONSUMER {usedBy: {usedBy}, accessOrgPositions: {whoCanAccess}  } )-[:Accessing]->(:DATA_ASSET {id:{dataid} ,name:{dataAsset}, subject:{dataSubject}, classification:{securityClassification}})-[:GETTING]->';

      //Relationship between Processing and application
      let transmissionStorageServerRelationshipQuery='MERGE ';

      let applicationDataAssetTransmissionSDotrageRelationship='MERGE (:DATA_ASSET {id:{dataid} ,name:{dataAsset}, subject:{dataSubject}, classification:{securityClassification}})-{:COLLECTED_BY}->(:APPLICATION {name:{appName}})';

      if(row.processingType.toLowerCase()==='transmission'){
        graphGenerationQuery+='(:TRANSMITTED { id:{rowNum},purpoce:{purpoce},source:{source},pIIclasification:{pIIclasification},categoryInfo:{categoryInfo} })';
        transmissionStorageServerRelationshipQuery+='(:TRANSMITTED{id:{rowNum}})-[:INTO { transferMechanism:{dataTransferMechanism}, securityControl:{securityControl}}]->(:SERVER_OR_SERVICE {name:{serviceName}})';
      } else if(row.processingType.toLowerCase()==='storage'){
        graphGenerationQuery+='(:STORED { id:{rowNum}, purpoce:{purpoce}, source:{source} , pIIclasification:{pIIclasification} , categoryInfo:{categoryInfo} })';
        transmissionStorageServerRelationshipQuery+='(:STORED)-[:INTO { transferMechanism:{dataTransferMechanism}, securityControl:{securityControl}}]->(:SERVER_OR_SERVICE {name:{serviceName}})';
      }

      graphGenerationQuery+='-[:FROM]->(:APPLICATION { name:{appName} })';
      graphGenerationQuery=graphGenerationQuery.replace(/\s/g, '');
      // graphGenerationQuery+=' '+applicationDataAssetTransmissionSDotrageRelationship.replace(/\s/g, '')+' '+transmissionStorageServerRelationshipQuery.replace(/\s/g, '');

      session.run(graphGenerationQuery,values).then((data)=>{
        // _emmiter.emit('inserted_row',rowNum);
        return session.run(applicationDataAssetTransmissionSDotrageRelationship,values);
      }).then((data)=>{
        return session.run(transmissionStorageServerRelationshipQuery,values);
      }).catch((error)=>{
        _emmiter.emit('insert_row_error',error);
        console.error(error);
      });
  }
}
