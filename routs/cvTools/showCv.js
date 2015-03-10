var express = require('express');
var app = express();

app.get('/showcv/[0-9]+/.+/?', function (req, res) {
    URLBit = new URLBit(req.url);
    cvId = URLBit.getURLBit(2);
    cv.showCV(req, res, cvId);
});

