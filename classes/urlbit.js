var URLBit = function (url) {
    this.url = url;
    this.urlParams = url.split('/');
}
URLBit.prototype.getURLBit = function(number) {
    return this.urlParams[number];
}
URLBit.prototype.isNumeric = function(number) {
    return this.urlParams[number].match(/^[0-9]$/g);
}
URLBit.prototype.isWord = function(number) {
    return this.urlParams[number].match(/\w+/g);
}
module.exports = URLBit;