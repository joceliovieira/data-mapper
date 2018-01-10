const express = require('express');
const router = express.Router();

router.get('/panel',function(req,res,next){
  res.render('mainPanel.html.twig',{
    'title': "Main Panel"
  });
});

router.get('/table',function(req,res,next){
  res.render('table.html.twig',{
    'title': "Data Assets"
  });
});

router.get('/flow-map',function(req,res,next){
  res.render('flow-map.html.twig',{
    'title': "Data Assets"
  });
});


module.exports=router;
