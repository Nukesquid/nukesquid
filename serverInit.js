var express = require('express');
var session = require('cookie-session');
var jade = require('jade');
var app = express();

// setting up viws
app.set('views', 'views');
app.set('view engine', 'jade');

// main rout
app.get('/', function(req, res){
	res.render('index.jade');
});

// bad rout
app.get('*', function(req, res){
	res.send('Bad rout');
});

app.listen(3000);
