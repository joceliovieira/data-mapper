const express = require('express');
const router = express.Router();

router.get('/panel',function(req,res,next){
  res.send('Panel main page');
});


module.exports=router;
