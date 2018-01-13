const express = require('express');
const fileUpload = require('express-fileupload');
const Excell = require('../services/excell.js');
const EventEmitter = require('events');

const router = express.Router();

const emmiter=new EventEmitter();
const excellReader = new Excell(emmiter);

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

  emmiter.on('excell_read_error',(message)=>{
    if(!res.headersSent) {
      response.message=message;
      res.json(response);
    }
  });

  emmiter.on('excell_read_start',()=>{
    if(!res.headersSent){
      response.status=true;
      res.json(response);
    }
  });

  excellReader.readAllLinesFromXLSXBufferAndProcessWithACallback(req.files.data_assets.data,(data,emmitter)=> {
    console.log("Read Line: ",data);
  });
});

router.get('/flow-map',function(req,res,next){
  res.render('flow-map.html.twig',{
    'title': "Data graph"
  });
});


module.exports=router;
