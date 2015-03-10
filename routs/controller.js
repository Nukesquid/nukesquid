/*
*
*	Handeling of all cv data passed to the server 
*
*/

var express = require('express');
var app = express();
var bp = require('body-parser');



app.post('/', bp.json(), function(req, res){
	console.log(req.body);
});

module.exports = app;
