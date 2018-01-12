const Excell = require('exceljs');
const EventEmitter = require('events');
const stream = require('stream');

module.exports=function(emmiter=null) {

  const self=this;

  /**
  * @var A private instance of the local event emmiter
  */
  let _emmiter=null;

  //If no emmites has been provided create one
  if(!emmiter){
    _emmiter = new EventEmitter();
  } else {
    _emmiter=emmiter;
  }

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

      const workbook= new Excell.Workbook();
      const bufferStream = new stream.PassThrough();
      bufferStream.end(data);
      bufferStream.pipe(workbook.xlsx.createInputStream());

      bufferStream.on('finish',()=>{
        _emmiter.emmit('excell_read_start',worksheet.actualRowCount);
        const worksheet = workbook.getWorksheet(1);
        console.log(worksheet);
        worksheet.eachRow((row, rowNumber) => {
          if(rowNumber === 1){return;}//Skip first line
          _emmiter.emmit('onRead',rowNumber,worksheet.actualRowCount);
          console.log(row)
          onReadCallback(row,_emmiter);
        });
      });

      bufferStream.on('error',()=>{
        _emmiter.emmit('excell_read_error',err);
      });
    return _emmiter;
  };
};
