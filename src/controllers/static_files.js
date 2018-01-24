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
const router = express.Router();

router.use('/', express.static(__dirname + '/../../www')); // redirect root

//Javascript routes
router.use('/js', [
  express.static(__dirname + '/../../node_modules/jquery/dist'),
  express.static(__dirname + '/../../node_modules/bootstrap/dist/js'),
  express.static(__dirname + '/../../node_modules/datatables-bootstrap/js'),
  express.static(__dirname + '/../../node_modules/bootstrap-datepicker/dist/js'),
  express.static(__dirname + '/../../node_modules/bootstrap-datepicker/dist/locales'),
  express.static(__dirname + '/../../node_modules/cytoscape/dist'),
  express.static(__dirname + '/../../node_modules/moment/min'),
  express.static(__dirname + '/../../www/js')
]);

//css routes
router.use('/css', [
  express.static(__dirname + '/../../node_modules/bootstrap/dist/css'),
  express.static(__dirname + '/../../node_modules/font-awesome/css'),
  express.static(__dirname + '/../../node_modules/bootstrap-datepicker/dist/css'),
  express.static(__dirname+'/../../node_modules/font-awesome-animation/dist'),
  express.static(__dirname + '/../../www/css')
]);

router.use('/fonts',[
  express.static(__dirname + '/../../node_modules/font-awesome/fonts'),
])

router.use('/images',[
  express.static(__dirname + '/../../node_modules/datatables/media/images'),

]);

module.exports=router;
