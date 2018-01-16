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
