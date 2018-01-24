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
const mongoose = require('mongoose');
const User = require('../models/account');

module.exports=function(config,emmiter){

  const self=this;
  const db=mongoose.createConnection(config.mongoDb.connection_string);;

  mongoose.connection.on("error", function(err) {
    emmiter.emit('mongodb_connection_error',err.message);
  });

  /**
  * All the login logic of a user
  * @param {String} username The user's username
  * @param {String} password The user's password
  * @param {Function} callback The user's callback
  */
  self.login=function(username,password,callback){

    if(!password || !username){
      return callback(new Error('Please provide the correct credentials'))
    }

    User.find({'username':username,'password':password},function(err,docs) {
      if(err){
        callback(err);
      }
      callback(null,docs);
    });
  };

  self.register=function(name,surname,username,password,email){

  };

  self.setNewPassowrd=function(id,currentPassword,newPassword){

  };

}
