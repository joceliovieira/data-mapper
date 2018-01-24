// const Excell = require('exceljs');
if(typeof require !== 'undefined') XLSX = require('xlsx');
const fileType = require('file-type');
const _=require('underscore');

const os = require('os');
const moment=require('moment');

const config=require('../config');


module.exports=function(config,emmiter) {

  const self=this;


  /**
  * Read the excell workbook based on template and process the results using a callback.
  *
  * @param {Buffer} data The data from the uploaded excell file
  * @param {Function} responseCallback Callback that returns stuff back to the http response
  * @param {Function} onReadCallback A callback that is used when the function reads an excell line.
  *
  * The callback should take the following parameters:
  * lineData: An object containing the data of the line
  * firstRowData: The labelrs that are in the first row
  * maxRows: How many rows the entry has
  * row: The current row
  * version: The upload version
  * nextCallback: The callback that handles the next iteration
  *
  * @return Emmiter
  */
  self.readAllLinesFromXLSXBufferAndProcessWithACallback = function(data,responseCallback,onReadCallback) {

      const type=fileType(data);
      // .xlsx files are zipped xml formats
      if(type && (type.mime === 'application/x-msi' || type.mime === 'application/zip')){

        let workbook=null;

        /*
        * Some excell files are zipped xml files.
        * Therefore we need to do extra checks in order to find out
        * if the provided file is an excell one or a simple zip.
        *
        * The best option is to use a try catch in order to catch any error.
        */
        try {
          workbook=XLSX.read(data,{type:"buffer"});
        } catch(err) {
          return responseCallback(new Error('You provided a non valid excell file.'));
        }

        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];

        const version=generateUid();

        return entryLengthValidations(worksheet,(error,rowCount) => {
          if(error) {
            return responseCallback(error)
          }
          getColumnDisplayNamesFormFirstLine(worksheet,(firstRowData)=>{
            iterateWorksheet(worksheet,rowCount,2,(rowData,maxRows,row,nextCallback)=>{
              onReadCallback(rowData,firstRowData,maxRows,row,version,nextCallback);
            });//Start readinng on second row
          },()=>{
            emmiter.emmit('read-complete',version);
          })
          return responseCallback(null,rowCount);
        });

      } else {
        return responseCallback(new Error('You provided a non valid excell file.'));
      }
  };

  /**
  * Calculate whether the excell spreadsheed has the correct column length and row length.
  * @param {Object} worksheet The worksheet that needs length validation.
  */
  const entryLengthValidations=function(worksheet,callback){

    const columnInfo=worksheet['!ref'].split(':');
    const lastColumn = columnInfo[columnInfo.length-1].charAt(0);

    if( lastColumn!==config.excell.maxColumn ) {
      return callback(new Error('The excell file is not into the valid format. Please use the valid template from the provided template!'));
    }

    const rowCount = parseInt(columnInfo[columnInfo.length-1].substr(1));
    if(rowCount <= 1){
      return callback(new Error('The excell file does not contain any entries at all!'));
    }

    callback(null,rowCount);
  }

  /**
  * An ASYNCRONOUS function that iterates the worksheet of a workbook.
  * @param {Object} worksheet The worksheet to Iterate.
  * @param {Int} maxRows Count how many rows have been iterated.
  * @param {Int} row read the current row.
  * @param {Function} callback A callback function that returns each row data.
  * @param {Function} onEndCallback A callback that indicated that the rows have been inserted
  */
  const iterateWorksheet=function(worksheet,maxRows,row,callback,onEndCallback){

    process.nextTick(function(){
      //Skipping first row
      if(row==1){
        return iterateWorksheet(worksheet,maxRows,2,callback);
      }

      if(row > maxRows){
        return onEndCallback();
      }

      const alphas=_.range('A'.charCodeAt(0),config.excell.maxColumn.charCodeAt(0));

      let rowData={};

      _.each(alphas,(column) => {
        column=String.fromCharCode(column);
        const item=column+row;
        const key=config.excell.columnMap[column];
        if(worksheet[item] && key ){
          rowData[key]=worksheet[item].v;
        }
      });

      return callback(rowData,maxRows,row,(error)=>{
        if(!error){
          return iterateWorksheet(worksheet,maxRows,row+1,callback);
        }
      });
    });
  }

  /**
  * Reads the first Line of the worksheer and returns its values
  * @param {Object} worksheet The worksheet that is used to get the information from the first line.
  * @param {Function} callback The callback that returns the result or the error.
  */
  const getColumnDisplayNamesFormFirstLine=function(worksheet,callback){

    let rowData={};

    const alphas=_.range('A'.charCodeAt(0),config.excell.maxColumn.charCodeAt(0));

    _.each(alphas,(column) => {
      column=String.fromCharCode(column);
      const item=column+1;
      const key=config.excell.columnMap[column];
      if(worksheet[item] && key ){
        rowData[key]=worksheet[item].v+'';//Enforcing into string convertion
      }
    });

    return callback(rowData);
  }

  /**
  * Create an Object with system-generated unique Identifiers
  * @return {Object}
  */
  const generateUid=function(){
    const time = moment().utc();
    const unix = time.valueOf();
    return {
      'date_unix':unix, //Keeping duplicate info for quicker search
      'date': time.format('D/M/YYYY'),//Keeping duplicate info for quicker search
      'version_name':os.hostname()+'_'+unix
    }
  }

};
