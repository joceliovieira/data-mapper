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
const express = require('express');
const fileUpload = require('express-fileupload');

function PanelController(expressApp, emmiter, io, excellReader, graphMaker){

  const router = express.Router();

  const room=io;

  emmiter.on('read-complete',function(version){
    io.emit('read-complete',version);
  });

  emmiter.on('insert_row_error',function(err,version,row){
    io.emit('insert-error',version,row);
  });

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
    }, graphMaker.insertFromExcellRow);
  });

  //Getting the graph page
  router.get('/flow-map',function(req,res,next){
    graphMaker.getVersionList(null,(error,data)=>{
      if(error){
        return res.status(500).end("Internal error occured");
      }
      return res.render('flow-map.html.twig',{
        'title':"Data graph",
        'versions':data
      });
    });

  });

  router.get('/flow-map/graph',function(req,res,next){
    const version=req.query.version;

    if(!version){
      return res.status(400).json({'message':'Please select a version to render'})
    }

    graphMaker.fetchDataAsGraph(version,(error,data)=>{
      if(error){
        console.log(error);
        return res.status(500).json()
      }
      res.json(data);
    })
  });

  router.get('/flow-map/table',function(req,res,next){
    const version=req.query.version;
    if(!version){
      return res.status(400).json({'message':'Please select a version to render'})
    }

    const page=req.query.page||1;
    const limit=req.query.limit||10;

    graphMaker.getTableRows(version,page,limit,(error,data)=>{
      if(error){
        console.log(error);
        return res.status(500).json()
      }
      res.render('widgets/htmlTableData.html.twig',{data:data}); //Needs some tranforming
    });
  });

  router.get('/versions',function(req,res,next){
    const version=req.query.version;
    graphMaker.getVersionList(version,(error,data)=>{
      if(error){
        return res.status(500).json({'message':'Could not fetch the versions'})
      }
      res.json(data);
    });
  })

  expressApp.use('/',router);
};

module.exports = PanelController;
