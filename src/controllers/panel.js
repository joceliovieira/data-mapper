const express = require('express');
const fileUpload = require('express-fileupload');

function PanelController(expressApp,emmiter, excellReader){

  const router = express.Router();

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

  //Upload data-assets
  router.post('/data_assets',function(req,res,next){
    const response={
                    'status':false, //By Default we assume that the user uploaded a non Excell file
                    'csrfToken':req.csrfToken() //Renew the CSRF token
    };

    excellReader.readAllLinesFromXLSXBufferAndProcessWithACallback(req.files.data_assets.data,(error,rowCount)=>{
      if(!res.headersSent) {
        if(error){
          response.message=error.message;
          return res.json(response);
        }
        response.status=true;
        response.rowCount=rowCount;
        return res.json(response);
      }
    },(data,emmitter)=> {
      console.log("Read Line: ",data);
    });
  });

  //Getting the graph page
  router.get('/flow-map',function(req,res,next){
    res.render('flow-map.html.twig',{
      'title': "Data graph"
    });
  });

  expressApp.use('/',router);
};

module.exports = PanelController;
