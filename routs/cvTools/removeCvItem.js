var express = require('express');
var app = express();

app.get('/removecvitem/[0-9]+/\w+/?', function (req, res) {
    URLBit = new URLBit(req.url);
    cdId = URLBit.getURLBit(2);
    itemType = URLBit.getURLBit(3);
    cv.removeCVItem(req, res, cdId, itemType);
});
