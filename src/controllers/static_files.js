const express = require('express');
const router = express.Router();

router.use('/', express.static(__dirname + '/../../www')); // redirect root

//Javascript routes
router.use('/js', express.static(__dirname + '/../../node_modules/bootstrap/dist/js')); // redirect bootstrap JS
router.use('/js', express.static(__dirname + '/../../node_modules/jquery/dist')); // redirect JS jQuery
router.use('/js',express.static(__dirname + '/../../www/js'));

//css routes
router.use('/css', express.static(__dirname + '/../../node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
router.use('/css',express.static(__dirname + '/../../www/css'));

module.exports=router;
