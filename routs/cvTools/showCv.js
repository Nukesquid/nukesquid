var express = require('express');
var app = express();

app.get('/showcv/:cvId([0-9]+)', function (req, res) {
    cv.showCV(req, res, req.params.cvId);
});