var express = require('express');
var app = express();

app.get('/searchcv/.+/?/', function (req, res) {
    URLBit = new URLBit(req.url);
    searchPhrase = URLBit.getURLBit(2);
    cv.findCV(req, res, searchPhrase);
});
