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

      if(type && type.mime==='application/x-msi'){
        const workbook=XLSX.read(data,{type:"buffer"});

        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];

        let last_column=worksheet['!ref'].split(':');
        last_column=last_column[last_column.length-1].charAt[0]
        console.log("Last column: "+last_column);
        if( last_column!==config.excell.maxColumn ) {
          return responseCallback(new Error('The excell file is not into the valid format. Please use the valid template from the provided template'));
        }
        iterateWorksheet(worksheet,onReadCallback);
        return responseCallback(null);
      } else {
        // return _emmiter.emit('excell_read_error','File is not a valid Excell format');
        return responseCallback(new Error('You provided a non valid excell file'));
      }
  };

  /**
  * An ASYNCRONOUS function that iterates the worksheet of a workbook
  * @param {Object} worksheet The worksheet to Iterate.
  * @param {Function} callback A callback function that returns the data.
  */
  const iterateWorksheet=function(worksheet,callback){
    process.nextTick(function(){
      //Use this one to get the column number: worksheet['!ref']
      //Count How many Columns the worksheet has It should have a predefined name of arrays

    });
  }
};
