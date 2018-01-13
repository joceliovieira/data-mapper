// const Excell = require('exceljs');
if(typeof require !== 'undefined') XLSX = require('xlsx');
const fileType = require('file-type');
const stream = require('stream');

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
        iterateWorksheet(worksheet,(error)=>{
          if(error){
            return responseCallback(new Error('File is not a valid Excell format'));
          }
        },onReadCallback);
        //@todo: remove this line and return it asyncronous
        responseCallback();
      } else {
        // return _emmiter.emit('excell_read_error','File is not a valid Excell format');
        return responseCallback(new Error('File is not a valid Excell format'));
      }
  };

  /**
  * An ASYNCRONOUS function that iterates the worksheet of a workbook
  * @param {Object} worksheet
  * @param {Function} callback
  *
  */
  const iterateWorksheet=function(worksheet,responseCallback,callback){
    process.nextTick(function(){
      console.log(worksheet);

    });
  }
};
