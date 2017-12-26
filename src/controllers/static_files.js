const express = require('express');
const router = express.Router();

router.use('/', express.static(__dirname + '/../../www')); // redirect root

//Javascript routes
router.use('/js', [
  express.static(__dirname + '/../../node_modules/jquery/dist'),
  express.static(__dirname + '/../../node_modules/bootstrap/dist/js'),
  express.static(__dirname + '/../../www/js')
]);

//css routes
router.use('/css', [
  express.static(__dirname + '/../../node_modules/bootstrap/dist/css'),
  express.static(__dirname + '/../../www/css')
]);


module.exports=router;