var express = require('express');
var app = express();

app.get('/updatecv/[0-9]+/.+/?', function (req, res) {
    URLBit = new URLBit(req.url);
    cdId = URLBit.getURLBit(2);
    cv.updateCV(req, res, cdId);
});
