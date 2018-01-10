const express = require('express');
const router = express.Router();

router.get('/panel',function(req,res,next){
  res.render('layout.html.twig',{
    'title': "Main Panel"
  });
});

router.get('/')


module.exports=router;
