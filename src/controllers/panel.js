const express = require('express');
const router = express.Router();

//Main Panel Page
router.get('/panel',function(req,res,next){
  res.render('mainPanel.html.twig',{
    'title': "Main Panel"
  });
});

// Data Assets Page
router.get('/data_assets',function(req,res,next){
  res.render('table.html.twig',{
    'title': "Data Asset Inventory",
    'csrfToken': req.csrfToken()
  });
});

router.post('/data_assets',function(req,res,next){
  res.json({'csrfToken':req.csrfToken()});
});

router.get('/flow-map',function(req,res,next){
  res.render('flow-map.html.twig',{
    'title': "Data graph"
  });
});


module.exports=router;
