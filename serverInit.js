var express = require('express');
var session = require('cookie-session');
var jade = require('jade');
var app = express();
// require subapps
var createSelfCv = require('./routs/addCv');

// setting up viws
app.set('views', 'views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/views/bootstrap'));


// main rout
app.get('/', function(req, res){
	res.render('index.jade');
});

//app.use('/newcv', createSelfCv);

// bad rout
app.get('*', function(req, res){
	res.send('Bad rout');
});


app.listen(3000);
console.log('server running on port 3000');
