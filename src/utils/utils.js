/**
FLOW-D a GDPR data flow mapping tool
Copyright (C) 2018 Desyllas Dimitrios

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

//Small utility libraries
const _ = require('underscore');

module.exports={
  /**
  * Check if a row of data contains data or not
  * @param {Object} row The row of data
  */
  'nonEmptyDataRowObject':function(row){

    if(!row || Object.keys(row).length===0){//Check if object contain keys
      return false;
    }

    return _.reduce(Object.keys(row),(previous,current)=>{
      if(row[current]){
        return previous && true;
      } else {
        return false;
      }
    },true);
  }
}
