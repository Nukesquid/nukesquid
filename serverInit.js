var express = require('express');
var session = require('cookie-session');
var jade = require('jade');
var app = express();

// require subapps
var cvAppRoot = './routs/cvTools/';
var createCv = require(cvAppRoot + 'createCv');
var removeCv = require(cvAppRoot + 'removeCv');
var controller = require('./routs/controller');
// setting up viws
app.set('views', 'views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/views/'));
app.use(express.static(__dirname + '/public/'));

// main rout
app.get('/', function(req, res){
	res.render('index.jade');
});
// sub app routs 
app.use('/createcv', createCv);
app.use('/controller', controller);


// bad rout
app.get('*', function(req, res){
	res.send('Bad rout');
});


app.listen(3000);
console.log('server running on port 3000');
