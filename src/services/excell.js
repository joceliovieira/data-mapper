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
  * @param {Function} onReadCallback A callback that is used when the function reads an excell line.
  *
  * The callback should take the following parameters:
  * lineData: An object containing the data of the line
  * emmiter: An object where the event emmiter gets passed
  *
  * @return Emmiter
  */
  self.readAllLinesFromXLSXBufferAndProcessWithACallback = function(data,onReadCallback) {

      const type=fileType(data);
      console.log(type);
      if(type && type.mime==='application/x-msi'){
        console.log("try")
        const workbook=XLSX.read(data,{type:"buffer"});
        console.log("Workbook Info: "+workbook);
        console.log(workbook);
        if(!workbook){
          return _emmiter.emit('excell_read_error',"Internal Error cannot read workbook, try to re-upload the excell file");
        } else {
          return _emmiter.emit('excell_read_start');
        }

      } else {
        console.log("Emmiting");
        return _emmiter.emit('excell_read_error','File is not a valid Excell format');
      }
  };

  /**
  * An ASYNCRONOUS function that iterates the worksheet of a workbook
  * @param
  */
  const iterateWorksheet=function(worksheet,callback){

  }
};
