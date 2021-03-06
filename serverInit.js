var express = require('express');
var session = require('cookie-session');
var jade = require('jade');
var app = express();
var mysql = require('mysql');
var dbClass = require('./classes/db.js');
var cvModel = require('./model/cvModel.js');
var db = new dbClass(mysql);
GLOBAL.cv = new cvModel(db);

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
/* Søk */
app.get('/search', function(req, res){
	res.render('search.jade', {scripts: ['/scripts/searchCv.js']});
});
/* Vis CV */
app.get('/showCv/([0-9]+)', function(req, res){
	res.render('showCv.jade', {scripts: ['/scripts/showCv.js']});
});
/* Vise brukere */
app.get('/showUsers', function(req, res){
	res.render('showUsers.jade', {scripts: ['/scripts/showUsers.js']});
});
/* Konsulentliste for cvKatalog*/
app.get('/users', function(req, res){
	res.render('brukerliste.jade');
});
/* Lister opp konsulents cver */
app.get('/cvliste/:userId', function(req,res){
	
});
app.use('/createcv', createCv);
app.use('/controller', controller);
/*
 *  
 * API-delen 
 * 
 */




/*
 * Vise en spesifikk CV
 */

app.get('/api/showCv/:cvId([0-9]+)', function(req, res){
	cv.showSingleCv(req, res, req.params.cvId);
});
/*
 * Vise alle CVene til en bruker
 */
app.get('/api/showUsersCv/:userId([0-9]+)', function(req, res){
	cv.showUserCv(req, res, req.params.userId);
});
/*
 * Søk i CVer
 */
app.get('/api/search/:searchPhrase(*)', function(req, res){
	cv.searchCV(req, res, req.params.searchPhrase);
});
/*
 * Vis alle brukere
 */
app.get('/api/showUsers', function(req, res){
	cv.showBrukere(req, res);
});
/*
 * Vis alle kunder
 */
app.get('/api/showCustomers', function(req, res){
	cv.showKunder(req, res);
});
/*
 * Vis alle referanser tilhørende en bruker
 */
app.get('/api/referanser/:userId([0-9]+)', function(req, res){
	console.log(req.params.userId + '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1');
	cv.showReferanser(req, res, req.params.userId);
});
/*
 * Vis alle teknologier
 */
app.get('/api/teknologier', function(req, res){
	cv.showTeknologier(req, res);
});
/* 
 * Vis all utdanning til en bruker
 */
app.get('/api/utdanning/:userId([0-9]+)', function(req, res){
	cv.showUtdanning(req, res, req.params.userId);
});
/*
// sub app routs 
app.use('/createcv', createCv);
app.use('/controller', controller);


// bad rout
app.get('*', function(req, res){
	res.send('Bad rout');
});

*/
app.listen(3000);
console.log('server running on port 3000');
