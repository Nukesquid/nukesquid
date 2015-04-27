/* Oppretter cv som et objekt, legger inn tilgang til databasen i objektet, */
/* og setter jsonOut til å være et tomt JSON-objekt                         */
var cv = function (db) {
    var super_ = this;
    this.db = db;
    this.jsonOut = {};
    this.cvId = null;
};
/* Henter ut en spesifikk CV basert på CVens Id */
cv.prototype.showSingleCv = function(req, res, cvId) {
    var super_ = this;
    this.getSingeCvJSON(cvId, function () {
        res.json(super_.jsonOut);
    });
};
/* Søk i CV basert på en tekststreng */
cv.prototype.searchCV = function(req, res, searchPhrase) {
    this.searchCVs(searchPhrase, function (rows) {
        res.json(rows);
    });
};
/* Viser alle CVene som hører til en spesifikk person basert på brukerId til personen */
cv.prototype.showUserCv = function(req, res, userId) {
    this.getUserCv(userId, function (rows) {
        res.json(rows);
    });
};
/* Returnerer alle CVene som hører til en spesifikk person basert på brukerId til personen */
cv.prototype.returnUserCv = function(userId, callback) {
    this.getUserCv(userId, function (rows) {
        calback(rows);
    });
};
/* Henter ut all utdanning en spesifikk bruker har registrert på seg */
cv.prototype.showUtdanning = function(req, res, userId) {
    this.getUtdanningData(userId, function (rows) {
        res.json(rows);
    });
};
/* Viser alle brukerene */
cv.prototype.showBrukere = function(req, res) {
    this.getBrukere(function (rows) {
        res.json(rows);
    });
};
/* Viser alle kunder */
cv.prototype.showKunder = function(req, res) {
    this.getKunder(function (rows) {
        res.json(rows);
    });
};
/* Henter ut all referanseinformasjon en spesifikk bruker har registrert på seg */
cv.prototype.showReferanser = function(req, res, userId) {
    var super_ = this;
    super_.getReferanseUserData(userId, function (rows) {
        var referanseTeknologiData = [];
        for(var i = 0; i < rows.length; i++) {
            super_.jsonOut[rows[i].referanseId] = {
                referanseId: rows[i].referanseId,
                informasjon: rows[i].referanseInformasjon,
                tidFra: rows[i].referanseTidFra,
                tidTil: rows[i].referanseTidTil,
                rolle: rows[i].referanseRolle,
                navn: rows[i].kundeNavn,
                teknologier: []
            };
            referanseTeknologiData.push(rows[i].referanseId);
        }
        /* Bygger en streng for IN() for å hente ut alle teknologier tilhørende alle referansene */
        var inClause = '';
        for(var j = 0; j < referanseTeknologiData.length; j++) {
            inClause += referanseTeknologiData[j];
            inClause += (j === referanseTeknologiData.length -1) ? '' : ',';
        }
        super_.getReferanseTeknologiData(inClause, function (rows) {
            for(var i = 0; i < rows.length; i++) {
                super_.jsonOut[rows[i].teknologiLinkReferanseId].teknologier.push({
                    navn: rows[i].teknologiNavn
                });
            }
            res.json(super_.jsonOut);
        });
    });
};
/* Henter ut alle teknologier som er lagt inn */
cv.prototype.showTeknologier = function(req, res) {
    var super_ = this;
    this.getTeknologier(function (rows) {
        for(var i = 0; i < rows.length; i++) {
            if(typeof super_.jsonOut[rows[i].teknologiKategoriNavn] === 'undefined') {
                super_.jsonOut[rows[i].teknologiKategoriNavn] = [];
            }
            super_.jsonOut[rows[i].teknologiKategoriNavn].push({
                teknologiId: rows[i].teknologiId,
                teknologiNavn: rows[i].teknologiNavn
            });
        }
        res.json(super_.jsonOut);
    });
};
/* Utvidet funksjon for å hente ut all informasjon om en spesifikk CV */
cv.prototype.getSingeCvJSON = function(cvId, cb) {
    var super_ = this;
    this.cvId = cvId;
    /* Henter ut hovedinformasjonen for en spesifikk CV */
    this.getSingleCvData(function(rows) {
        super_.jsonOut.intro = rows[0].cvIntroduksjon;
        super_.jsonOut.cvNavn = rows[0].cvNavn;
        super_.jsonOut.brukerFornavn = rows[0].brukerFornavn;
        super_.jsonOut.brukerEtternavn = rows[0].brukerEtternavn;
        super_.jsonOut.brukerEpost = rows[0].brukerEpost;
        super_.jsonOut.telefon = rows[0].brukerTeleon;
        super_.jsonOut.utdanning = [];
        super_.jsonOut.referanser = [];
        super_.jsonOut.teknologier = [];
        super_.getUtdanningData(function (rows) {
            for(var i = 0; i < rows.length; i++) {
                super_.jsonOut.utdanning.push({
                    sted: rows[i].utdanningSted,
                    grad: rows[i].utdanningGrad,
                    tid: rows[i].utdanningTid
                });
            }
            super_.getReferanseData(function (rows) {
                var cvTeknologiData = [];
                for(var i = 0; i < rows.length; i++) {
                    super_.jsonOut.referanser[rows[i].referanseId] = {
                        informasjon: rows[i].referanseInformasjon,
                        tidFra: rows[i].referanseTidFra,
                        tidTil: rows[i].referanseTidTil,
                        rolle: rows[i].referanseRolle,
                        navn: rows[i].kundeNavn,
                        teknologier: []
                    };
                    cvTeknologiData.push(rows[i].referanseId);
                }
                /* Bygger en streng for IN() for å hente ut alle teknologier tilhørende referansen */
                var inClause = '';
                for(var j = 0; j < cvTeknologiData.length; j++) {
                    inClause += cvTeknologiData[j];
                    inClause += (j === cvTeknologiData.length -1) ? '' : ',';
                }
                super_.getReferanseTeknologiData(inClause, function (rows) {
                	if(typeof rows !== 'undefined') {
                        for(var i = 0; i < rows.length; i++) {
                            super_.jsonOut.referanser[rows[i].teknologiLinkReferanseId].teknologier.push({
                            navn: rows[i].teknologiNavn
                        });
                        }
                    }
                    super_.getTeknologiData(function(rows) {
                        for(var i = 0; i < rows.length; i++) {
                            super_.jsonOut.teknologier.push({
                                navn: rows[i].teknologiNavn,
                                kategoriNavn: rows[i].teknologiKategoriNavn
                            });
                        }
                        cb();
                    });
                });
            });
        });
    });
};
/* Opprette bruker(e) */
cv.prototype.userInserter = function (userObj){
	for(var i = 0; i < userObj.length; i++) {
		var iteration = userObj[i];
		if(iteration.brukerFornavn !== '' && iteration.brukerFornavn !== undefined &&
			iteration.brukerEtternavn !== '' && iteration.brukerEtternavn !== undefined &&
			iteration.brukerEpost !== '' && iteration.brukerEpost !== undefined &&
			iteration.brukerTelefon !== '' && iteration.brukerTelefon !== undefined) {
			this.db.query('INSERT INTO Brukere SET ?', iteration);
		}
	}
};
/* Kobler sammen elementer i CVen */
cv.prototype.connects = function(cvObj) {
	for (var i = 0; i < cvObj.length; i++) {
		var iteration = cvObj[i];
		if(iteration.brukerId !== '' && iteration.brukerId !== undefined) {
			if(iteration.cvId !== '' && iteration.cvId !== undefined) {
				if(iteration.utdanningId !== '' && iteration.utdanningId !== undefined) {
					this.db.query('INSERT INTO UtdanningLink SET ?', {utdanningLinkCvId : iteration.cvId, utdanningLinkUtdanningId : iteration.utdanningId});
				}
				if (iteration.referanseId !== '' && iteration.referanseId !== undefined){
					this.db.query('INSERT INTO ReferanseLink SET referanseId = :referanseIdId, cvId = :cvId', {referanseLinkCvId : iteration.cvId, referanseLinkReferanseId : iteration.referanseId});
				}
			}
		}
	}
};
/* Sletter koblinger i CVen */
cv.prototype.removes = function(author, cvObj) {
	for(var i = 0; i < cvObj.length; i++) {
		var iteration = cvObj[i];
		if (iteration.brukerId !== '' && iteration.brukerId !== undefined) {
			if (iteration.cvId !== '' && iteration.cvId !== undefined) {
				this.db.query('DELETE FROM TeknologiLink WHERE teknologiLinkCvId = :cvId', iteration);
				this.db.query('DELETE FROM ReferanseLink WHERE referanseLinkCvId = :cvId', iteration);
				this.db.query('DELETE FROM UtdanningLink WHERE utdanningLinkCvId = :cvId', iteration);
				this.db.query('DELETE FROM Cv WHERE cvID = :cvId AND cvBrukerID = :brukerId', iteration);
			}
			if (iteration.referanseId !== '' && iteration.referanseId !== undefined) {
				this.db.query('DELETE FROM TeknologiLink WHERE TeknologiLinkReferanseId = :referanseId', iteration);
				this.db.query('DELETE FROM ReferanseLink WHERE ReferanseLinkReferanseId = :referanseId', iteration);
				this.db.query('DELETE FROM Referanser WHERE referanseId = :referanseId AND brukerId = :brukerId', iteration);
			}
			if (iteration.utdanningId !== '' && iteration.utdanningId !== undefined) {
				this.db.query('DELETE FROM UtdanningLink WHERE utdanningLinkUtdanningId = :utdanningId',iteration);
				this.db.query('DELETE FROM Utdanning WHERE utdanningid = :utdanningId AND utdanningBrukerId = :brukerId', iteration);
			}
		}
	}
};
/* Oppdatere CV */
cv.prototype.updates = function(author, cvObj) {
	for(var i = 0; i < cvObj.length; i++) {
		var iteration  = cvObj[i];
		if(iteration.cvMain !== undefined) {
			if(iteration.cvMain.cvId !== '' && iteration.cvMain.cvId !== undefined) {
				var cvMain = iteration.cvMain;
				cvMain.brukerId = iteration.brukerId;
				this.db.query('UPDATE Cv SET endreatDato = NOW(), cvNavn = :cvName, cvIntroduksjons = :cvIntroduksjon WHERE cvBrukerID = :brukerId AND cvID = :cvId', cvMain);
				if(cvMain.cvTags !== undefined) {
					this.db.query('DELETE FROM TeknologiLink WHERE TeknologiLinkCvId = :cvId', cvMain);
					for (var l = 0; l < cvMain.cvTags.length; l++) {
						this.db.query('INSERT INTO TeknologiLink SET ?', {teknologiLinkCvId : cvMain.cvId, teknologiLinkTeknologiId:cvMain.cvTags[l]});
					}
				}
			}
		}
		if(iteration.cvExperiences !== undefined) {
			if(iteration.cvExperience.referanseId !== '' && iteration.cvExperience.referanseId !== undefined) {
				var cvReferanse = iteration.cvExperience;
				cvReferanse.brukerId = iteration.brukerId;
				this.db.query('UPDATE Referanser SET referanseRolle = :referanseRolle, referanseKundeId = :referanseKundeId, referanseTidFra = :referanseTidFra, referanseTidTil = :referanseTidTil, referanseInformasjon = :referanseInformasjon WHERE referanseBrukerId = :brukerId AND referanseId = :referanseId', cvReferance);
				if (cvReferance !== undefined){
					this.db.query('DELETE FROM TeknologiLink WHERE teknologiId = :id', cvReferance);
					for(var m = 0; m < cvReferance.cvTags.length; m++) {
						this.db.query('INSERT INTO TeknologiLink SET ?', {teknologiLinkReferanseId : cvReferance.id, teknologiLinkTeknologiId:cvReferance.cvTags[m]});
					}
				}
			}
		}
		if(iteration.edu !== undefined) {
			if(iteration.edu.utdanningId !== '' && iteration.edu.utdanningId !== undefined) {
				var edu = iteration.edu;
				edu.brukerId = iteration.brukerId;
				this.db.query('UPDATE Utdanning SET utdanningSted = :utdanningSted, utdanningGrad = :utdanningGrad WHERE utdanningId = :utdanningId AND utdanningBrukerId = :brukerId', edu);
			}
		}
	}
};
/* Legger inn CV i databasen */
cv.prototype.cvInserts = function(author, cvObj) {
	var super_ = this;
	console.log('cvInserts sayes hi');
	// iterate through new elements
	for(var i = 0; i < cvObj.length; i++) {
		this.brukerId = cvObj[i].brukerId;
		console.log(cvObj[i].mainCv.cvNavn + cvObj[i].mainCv.cvIntroduksjon);
		if(cvObj[i].mainCv.cvNavn !== '' && cvObj[i].mainCv.cvIntroduksjon !== '' && cvObj[i].mainCv.cvTags.length !== 0) {
			console.log('CvMain was added');
			var cvTags = cvObj[i].mainCv.cvTags;
			this.db.query('INSERT INTO Cv SET ?', {/*createdBy: author,*/
				cvBrukerId: cvObj[i].brukerId,
				cvIntroduksjon : cvObj[i].mainCv.cvIntroduksjon,
				cvNavn: cvObj[i].mainCv.cvNavn}, function (result) {
				for (var l = 0; l < cvTags.length; l++) {
					console.log(result);
					super_.db.query('INSERT INTO TeknologiLink SET ?', {TeknologiLinkCvId: result.insertId, teknologiLinkTeknologiId: cvTags[l]});
				}
			});
			console.log('cv har kanskje blitt opprettet');
		}
		if(cvObj[i].edu.utdanningSted !== '' && cvObj[i].edu.utdanningGrad !== ''){
			this.db.query('INSERT INTO Utdanning SET ?', {
				utdanningBrukerId : this.brukerId,
				utdanningSted : cvObj[i].edu.utdanningSted,
				utdanningGrad : cvObj[i].edu.utdanningGrad
			});
		}
		if (cvObj[i].cvExperience.referanseRolle !== '' && cvObj[i].cvExperience.referanseKundeId !== '' && cvObj[i].cvExperience.referanseTidFra !== '' &&
				cvObj[i].cvExperience.referanseTidTil !== '' && cvObj[i].cvExperience.referanseInformasjon !== '' && cvObj[i].cvExperience.tags.length !== 0){
			var ExpTags = cvObj[i].cvExperience.tags;
			this.db.query('INSERT INTO Referanser SET ?', {
					referanseBrukerId : this.brukerId,
					referanseInformasjon : cvObj[i].cvExperience.referanseInformasjon,
					referanseTidFra : cvObj[i].cvExperience.referanseTidFra,
					referanseTidTil : cvObj[i].cvExperience.referanseTidTil,
					referanseRolle : cvObj[i].cvExperience.referanseRolle,
					referanseKundeId : cvObj[i].cvExperience.referanseKundeId
				}, function (result) {
					for (var m = 0; m < ExpTags.length; m++) {
						super_.db.query('INSERT INTO TeknologiLink SET ?', {teknologiLinkReferanseId: result.insertId,
							teknologiLinkTeknologiId: ExpTags[m]});
					}
				}
			);
		}
		
	}
};
/* Alt under dette punktet er MySQL-spørringer som hører til funksjonene over */
cv.prototype.getTeknologier = function (callback) {
    this.db.query("SELECT teknologiId, teknologiNavn, teknologiKategoriNavn FROM Teknologier INNER JOIN TeknologiKategorier ON TeknologiKategorier.teknologiKategoriId = Teknologier.teknologiKategoriId ORDER BY teknologiKategoriNavn ASC", {}, callback);
};
cv.prototype.getUserCv = function (userId, callback) {
    this.db.query("SELECT cvId, cvBrukerId, cvNavn, cvOpprettetDato, cvEndretDato FROM Cv WHERE ? ORDER BY cvNavn ASC", {cvBrukerId: userId}, callback);
};
cv.prototype.getSingleCvData = function(callback) {
    this.db.query("SELECT cvId, cvIntroduksjon, cvNavn, brukerFornavn, brukerEtternavn, brukerEpost, brukerTelefon FROM Cv INNER JOIN Brukere ON Cv.cvBrukerId = Brukere.brukerId WHERE ?", {cvId: this.cvId}, callback);
};
/*cv.prototype.getUtdanningData = function(callback) {
    this.db.query("SELECT utdanningSted, utdanningGrad, utdanningTid FROM Utdanning INNER JOIN UtdanningLink ON Utdanning.utdanningId = UtdanningLink.utdanningLinkUtdanningId WHERE ?", {utdanningLinkCvId: this.cvId}, callback);
};*/
cv.prototype.getReferanseData = function(callback) {
    this.db.query("SELECT referanseId, referanseInformasjon, referanseTidFra, referanseTidTil, referanseRolle, kundeNavn FROM Referanser INNER JOIN Kunder ON Referanser.referanseKundeId = Kunder.kundeId INNER JOIN ReferanseLink ON ReferanseLink.referanseLinkReferanseId = Referanser.referanseId WHERE ?", {referanseLinkCvId: this.cvId}, callback);
};
cv.prototype.getReferanseTeknologiData = function(inClause, callback) {
	if(inClause != '') {
	    this.db.query("SELECT teknologiNavn, teknologiLinkReferanseId FROM TeknologiLink INNER JOIN Teknologier ON TeknologiLink.teknologiLinkTeknologiId = Teknologier.teknologiId WHERE teknologiLinkReferanseId IN(" + inClause + ")", {}, callback);
	} else {
		callback();
	}
};
cv.prototype.getTeknologiData = function(callback) {
    this.db.query("SELECT teknologiNavn, teknologiKategoriNavn FROM Teknologier INNER JOIN TeknologiKategorier ON Teknologier.teknologiKategoriId = TeknologiKategorier.teknologiKategoriId INNER JOIN TeknologiLink ON Teknologier.teknologiId = TeknologiLink.teknologiLinkTeknologiId WHERE ?", {teknologiLinkCvId: this.cvId}, callback);
};
cv.prototype.getReferanseUserData = function(userId, callback) {
    this.db.query("SELECT referanseId, referanseInformasjon, referanseTidFra, referanseTidTil, referanseRolle, kundeNavn FROM Referanser INNER JOIN Kunder ON Referanser.referanseKundeId = Kunder.kundeId INNER JOIN ReferanseLink ON ReferanseLink.referanseLinkReferanseId = Referanser.referanseId WHERE ?", {referanseBrukerId: userId}, callback);
};
cv.prototype.getUtdanningData = function(userId, callback) {
    this.db.query("SELECT utdanningId, utdanningSted, utdanningGrad, utdanningTid FROM Utdanning WHERE ?", {utdanningBrukerId: userId}, callback);
};
cv.prototype.getBrukere = function(callback) {
    this.db.query("SELECT brukerId, brukerFornavn, brukerEtternavn, brukerEpost, brukerTelefon FROM Brukere ORDER BY brukerEtternavn ASC, brukerFornavn ASC", {}, callback);
};
cv.prototype.getKunder = function(callback) {
    this.db.query("SELECT kundeId, kundeNavn FROM Kunder ORDER BY kundeNavn ASC", {}, callback);
};
cv.prototype.searchCVs = function(searchPhrase, callback) {
    var phrase = this.db.escape('%' + searchPhrase + '%');
    this.db.query("SELECT cvId, cvNavn FROM Cv " +
                  "LEFT JOIN ReferanseLink ON referanseLinkCvId = cvId " +
                  "LEFT JOIN Referanser ON referanseId = referanseLinkReferanseId " +
                  "LEFT JOIN Kunder ON kundeId = referanseKundeId " +
                  "LEFT JOIN Brukere ON brukerId = cvBrukerId " +
                  "LEFT JOIN UtdanningLink ON utdanningLinkCvId = cvId " +
                  "LEFT JOIN Utdanning ON utdanningId = utdanningLinkUtdanningId " +
                  "LEFT JOIN TeknologiLink ON teknologiLinkCvId = cvId " +
                  "LEFT JOIN Teknologier ON teknologiId = teknologiLinkTeknologiId " +
                  "WHERE cvNavn LIKE " + phrase +
                  " OR teknologiNavn LIKE " + phrase +
                  " OR kundeNavn LIKE " + phrase +
                  " OR brukerFornavn LIKE " + phrase +
                  " OR brukerEtternavn LIKE " + phrase +
                  " OR utdanningGrad LIKE " + phrase +
                  " OR kundeNavn LIKE " + phrase +
                  " OR referanseInformasjon LIKE " + phrase +
                  " OR cvIntroduksjon LIKE " + phrase +
                  " OR cvNavn LIKE " + phrase +
                  "GROUP BY cvId", {}, callback);
};
module.exports = cv;
