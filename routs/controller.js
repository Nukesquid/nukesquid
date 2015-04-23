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


// creates users
function userInserter(obj){
	for (i=0;i<obj.length;i++){
		var iteration = obj[i];
		if (iteration.fornavn !== '' && iteration.fornavn !== undefined && 
			iteration.etternavn !== '' && iteration.etternavn !== undefined &&
			iteration.epost !== '' && iteration.epost !== undefined &&
			iteration.tlf !== '' && iteration.tlf !== undefined){
				sql.query('INSERT INTO Brukere SET ?', iteration);
			}
	}

}

// connect cvelements
function connects(obj){
	for (i=0;i<obj.length;i++){
		var iteration = obj[i];
		if (iteration.user !== '' && iteration.user !== undefined){
			if (iteration.cvMainId !== '' && iteration.cvMainId !== undefined){
				if (iteration.eduId !== '' && iteration.eduId !== undefined) {
					sql.query('INSERT INTO UtdanningLink SET utdanningId = :eduId, cvId = :cvMainId', iteration);	
				}
				if (iteration.cvExperience !== '' && iteration.cvExperience !== undefined){
					sql.query('INSERT INTO ReferanseLink SET referanseId = :cvExperienceId, cvId = :cvMainId', iteration);
				}
			}
		}
	}


}

// Delete cv elements
function removes(author, obj){
	for (i=0;i<obj.length;i++){
		var iteration = obj[i];
		if (iteration.user !== '' && iteration.user !== undefined){
			if (iteration.cvMainId !== '' && iteration.cvMainId !== undefined){
				sql.query('REMOVE FROM TeknologiLink WHERE cvId = :cvMainId', iteration);
				sql.query('REMOVE FROM ReferanseLink WHERE cvId = :cvMainId', iteration);
				sql.query('REMOVE FROM UtdanningLink WHERE cvId = :cvMainId', iteration);
				sql.query('REMOVE FROM Cv WHERE cvID = :cvMainId AND brukerID = :user', iteration);
			}
			if (iteration.cvExperienceId !== '' && iteration.cvExperienceId !== undefined){
				sql.query('REMOVE FROM TeknologiLink WHERE referanseId = :cvExperienceId', iteration);
				sql.query('REMOVE FROM ReferanseLink WHERE referanseId = :cvExperienceId', iteration);
				sql.query('REMOVE FROM Referanser WHERE referanseId = :cvExperienceId AND brukerId = :user', iteration);
			}
			if (iteration.eduId !== '' && iteration.eduId !== undefined){
				sql.query('REMOVE FROM UtdanningLink WHERE utdanningId = :eduId',iteration);
				sql.query('REMOVE FROM Utdanning WHERE utdanningid = :eduId AND brukerId = :user', iteration);
			}
		}
	}

}

// updating existing cvObjects in database
function updates(author, obj){
	for (i=0;i<obj.length;i++){
		var iteration  = obj[i];
		if (iteration.cvMain !== undefined) {
			if (iteration.cvMain.id !== '' && iteration.cvMain.id !== undefined){
				var cvMain = iteration.cvMain;
				cvMain.user = iteration.user;
				sql.query('UPDATE Cv SET endreatDato = NOW(), cvNavn = :cvName, cvIntroduksjonsText = :introTxt WHERE brukerID = :user AND cvID = :id', cvMain );
				if (cvMain.cvTags !== undefined){
					sql.query('REMOVE FROM TeknologiLink WHERE cvId = :id', cvMain);
					for (l=0;l<cvMain.cvTags.length;l++){
						sql.query('INSERT INTO TeknologiLink SET ?', {cvId : cvMain.id, teknologiId:cvMain.cvTags[l]});
					}
				}
			}
		}
		if (iteration.cvExperiences !== undefined) {
			if (iteration.cvExperience.id !== '' && iteration.cvExperience.id !== undefined){
				var cvReferance = iteration.cvExperience;
				cvReferance.user = iteration.user;
				sql.query('UPDATE Referanser SET referanseRolle = :role, kundeId = :client, tidFra = :from, tidTil = :to, referanseTekst = :body WHERE brukerId = :user AND referanseId = :id', cvReferance);
				if (cvReferance !== undefined){
					sql.query('REMOVE FROM TeknologiLink WHERE teknologiId = :id', cvReferance);
					for (l=0;l<cvReferance.cvTags.length;l++){
						sql.query('INSERT INTO TeknologiLink SET ?', {referanseId : cvReferance.id, teknologiId:cvReferance.cvTags[l]});
					}
				}
			}
		}
		if (iteration.edu !== undefined){
			if (iteration.edu.id !== '' && iteration.edu.id !== undefined){
			var edu = iteration.edu;
			edu.user = iteration.user;
			sql.query('UPDATE Utdanning SET utdanningSted = :sted, utdanningGrad = :grad WHERE utdanningid = :id AND brukerId = :user', edu);
			}
		}
	}

}


// placing new elements into database
function cvInserts(author, obj){
	console.log(obj);
	// iterate through new elements
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
	if (json.author !== '' && json.author !== undefined){
		if (json.createCv === '[object Array]'){
			cvInserts(json.author,json.createCv);
		}
		if (json.updateCv === '[object Array]'){
			updates(json.author,json.updateCV);
		}
		if (json.deleteCv === '[object Array]'){
			removes(json.author,json.deleteCv);
		}
		if (json.assembleCv === '[object Array]'){
			connects(json.assembleCv);
		}
	}
}

app.post('/', bp.json(), function(req, res){
	dataParser(req.body);
	//console.log(req.body);
});

module.exports = app;
