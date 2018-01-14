// const Excell = require('exceljs');
if(typeof require !== 'undefined') XLSX = require('xlsx');
const fileType = require('file-type');
const stream = require('stream');
const config=require('../config');


module.exports=function(emmiter) {

  const self=this;

  /**
  * @var A private instance of the local event emmiter
  */
  let _emmiter=emmiter;

  /**
  * Read the excell workbook based on template and process the results using a callback.
  *
  * @param {Buffer} data The data from the uploaded excell file
  * @param {Function} responseCallback Callback that returns stuff back to the http response
  * @param {Function} onReadCallback A callback that is used when the function reads an excell line.
  *
  * The callback should take the following parameters:
  * lineData: An object containing the data of the line
  * emmiter: An object where the event emmiter gets passed
  *
  * @return Emmiter
  */
  self.readAllLinesFromXLSXBufferAndProcessWithACallback = function(data,responseCallback,onReadCallback) {

      const type=fileType(data);
      console.log(type);
      // .xlsx files are zipped xml formats
      if(type && (type.mime === 'application/x-msi' || type.mime === 'application/zip')){
        const workbook=XLSX.read(data,{type:"buffer"});

        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];

        return entryLengthValidations(worksheet,(error,rowCount) => {
          if(error) {
            return responseCallback(error)
          }
          iterateWorksheet(worksheet,rowCount,onReadCallback);
          return responseCallback(null,rowCount);
        });

      } else {
        return responseCallback(new Error('You provided a non valid excell file'));
      }
  };

  /**
  *
  */
  const entryLengthValidations=function(worksheet,callback){

    const columnInfo=worksheet['!ref'].split(':');
    const lastColumn = columnInfo[columnInfo.length-1].charAt(0);

    if( lastColumn!==config.excell.maxColumn ) {
      return callback(new Error('The excell file is not into the valid format. Please use the valid template from the provided template!'));
    }

    const rowCount = parseInt(columnInfo[columnInfo.length-1].substr(1));
    console.log(rowCount);
    if(rowCount <= 1){
      return callback(new Error('The excell file does not contain any entries at all!'));
    }

    callback(null,rowCount);
  }

  /**
  * An ASYNCRONOUS function that iterates the worksheet of a workbook
  * @param {Object} worksheet The worksheet to Iterate.
  * @param {Function} callback A callback function that returns the data.
  */
  const iterateWorksheet=function(worksheet,rowCount,callback){
    process.nextTick(function(){
      //Use this one to get the column number: worksheet['!ref']
      //Count How many Columns the worksheet has It should have a predefined name of arrays

    });
  }
};
