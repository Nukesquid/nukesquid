/*
*
*	Handeling of all cv data passed to the server 
*
*/

var express = require('express');
var app = express();
var bp = require('body-parser');
// mysql connection
sql = require('mysql').createConnection({
	host : 'localhost',
	user : 'root',
	password : 'kakeboks',
	database : 'cvApp'
});



function inserts(author, obj){
	console.log(obj);
	for (i=0;i<obj.length;i++){
		this.user = obj[i].user;
		if (obj[i].mainCv.cvNavn !== '' && obj[i].mainCv.introTxt !== '' && obj[i].mainCv.cvTags.length !== 0){
			this.cvTags = obj[i].mainCv.cvTags;
			sql.query('INSERT INTO Cv SET ?', {/*createdBy: author,*/ 
				brukerId: obj[i].user, 
				cvIntroduksjon : obj[i].mainCv.introTxt, 
				cvNavn: obj[i].mainCv.cvName}, function (err, result){
					for (l=0;l<cvTags.length;l++){
						sql.query('INSERT INTO TeknologiLink SET ?', {cvId: result.insertId,
							teknologiId: cvTags[l]});
				}
			});	
		}
		if (obj[i].edu.sted !== '' && obj[i].edu.grad !== ''){
			sql.query('INSERT INTO Utdanning SET ?', {brukerId : this.user,
				utdanningSted : obj[i].edu.sted,
				utdanningGrad : obj[i].edu.grad});
		}
		if (obj[i].cvExperience.role !== '' && obj[i].cvExperience.client !== '' && obj[i].cvExperience.from !== '' &&
			obj[i].cvExperience.to !== '' && obj[i].cvExperience.body !== '' && obj[i].cvExperience.tags.length !== 0){
			this.ExpTags = obj[i].cvExperience.tags;
			sql.query('INSERT INTO Referanser SET ?', {brukerId : this.user,
				referanseTekst : obj[i].cvExperience.body,
				tidFra : obj[i].cvExperience.from, 
				tidTil : obj[i].cvExperience.to,
				referanseRolle : obj[i].cvExperience.role,
				kundeId : obj[i].cvExperience.client}, function (err, result){
					for (l=0;l<ExpTags.length;l++){
						sql.query('INSERT INTO TeknologiLink SET ?', {referanseId: result.insertId,
							teknologiId: ExpTags[l]});
					}
				});
		}
		
	}
}

function dataParser(json){
	console.log('dataParser sayes hi');
	inserts(json.author,json.createCv);
}

app.post('/', bp.json(), function(req, res){
	dataParser(req.body);
	//console.log(req.body);
});

module.exports = app;
