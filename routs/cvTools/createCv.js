var express = require('express');
var app = express()

// create cv root
app.get('/', function (req, res) {
	res.render('createCv.jade');
});

// returns form for desired cv entry
app.get('/:addPart?', function (req, res){
	var addPart = req.params.addPart;
	try{
		res.render('./includes/createCv/' + addPart + '.jade');
	} catch (err){
		res.send('bad request');
	}
});

module.exports = app;
