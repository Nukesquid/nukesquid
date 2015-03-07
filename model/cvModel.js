var cv = function (cvId) {
    this.cvId = cdId;
}
cv.prototype.listCVs = function(req, res) {
    res.render('index', {testh: 'Liste over dine CVer'});
}
module.exports = cv;