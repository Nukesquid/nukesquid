var express = require('express');
var app = express()

app.get('/', function (req, res) {
	res.send('create cv app')
;});

module.export = app;
