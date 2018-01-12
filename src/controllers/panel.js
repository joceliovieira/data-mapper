const express = require('express');
const fileUpload = require('express-fileupload');
const Excell = require('../services/excell.js');

const router = express.Router();

const excellReader = new Excell();

router.use(fileUpload());

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
  const response={
                  'status':false, //By Default we assume that the user uploaded a non Excell file
                  'csrfToken':req.csrfToken() //Renew the CSRF token
  };

  const emmiter=excellReader.readAllLinesFromXLSXBufferAndProcessWithACallback(req.files.data_assets.data,(data,emmitter)=> {
    console.log("Read Line: ",data);
  });

  emmiter.on('read_start',()=>{
    response.status=true;
    res.json(response);
  });

  emmiter.on('excell_read_error',()=>{
    res.json(response);
  });
});

router.get('/flow-map',function(req,res,next){
  res.render('flow-map.html.twig',{
    'title': "Data graph"
  });
});


module.exports=router;
