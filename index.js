var URLBit = require('./classes/urlbit.js');
var cvModel = require('./model/cvModel.js');
var express = require('express')
var app = express()
app.set('views', './views/');
app.set('view engine', 'jade');
function ensureAuthenticated(req, res) {
    if (!user.isAuthenticated()) {
        res.redirect('/login');
    }
}

app.get('/', function (req, res) {
    cv = new cvModel(null);
    cv.listCVs(req, res);
})
app.get('/login', function (req, res) {
    user.login(req, res);
})
app.get('/showcv/[0-9]+/.+/?', function (req, res) {
    URLBit = new URLBit(req.url);
    cvId = URLBit.getURLBit(2);
    cv.showCV(req, res, cvId);
})
app.get('/findcv/.+/?/', function (req, res) {
    URLBit = new URLBit(req.url);
    searchPhrase = URLBit.getURLBit(2);
    cv.findCV(req, res, searchPhrase);
})
app.get('/updatecv/[0-9]+/.+/?', function (req, res) {
    URLBit = new URLBit(req.url);
    cdId = URLBit.getURLBit(2);
    cv.updateCV(req, res, cdId);
})
app.get('/newcv/?', function (req, res) {
    cv.newCV(req, res);
})
app.get('/addcvitem/[0-9]+/\w+/.*/?', function (req, res) {
    URLBit = new URLBit(req.url);
    cdId = URLBit.getURLBit(2);
    itemType = URLBit.getURLBit(3);
    itemValue = URLBit.getURLBit(4);
    cv.addCVItem(req, res, cvId, itemType, itemValue);
})
app.get('/removecvitem/[0-9]+/\w+/?', function (req, res) {
    URLBit = new URLBit(req.url);
    cdId = URLBit.getURLBit(2);
    itemType = URLBit.getURLBit(3);
    cv.removeCVItem(req, res, cdId, itemType);
})
var server = app.listen(80, function () {
    console.log('Server startet');
})