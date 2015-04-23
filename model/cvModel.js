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
        super_.jsonOut.fornavn = rows[0].brukerFornavn;
        super_.jsonOut.etternavn = rows[0].brukerEtternavn;
        super_.jsonOut.epost = rows[0].brukerEpost;
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
                        for(var i = 0; i < rows.length; i++) {
                            super_.jsonOut.referanser[rows[i].teknologiLinkReferanseId].teknologier.push({
                            navn: rows[i].teknologiNavn
                        });
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
		if(iteration.fornavn !== '' && iteration.fornavn !== undefined &&
			iteration.etternavn !== '' && iteration.etternavn !== undefined &&
			iteration.epost !== '' && iteration.epost !== undefined &&
			iteration.tlf !== '' && iteration.tlf !== undefined) {
			this.db.query('INSERT INTO Brukere SET ?', iteration);
		}
	}
};
/* Kobler sammen elementer i CVen */
cv.prototype.connects = function(cvObj) {
	for (var i = 0; i < cvObj.length; i++) {
		var iteration = cvObj[i];
		if(iteration.user !== '' && iteration.user !== undefined) {
			if(iteration.cvMainId !== '' && iteration.cvMainId !== undefined) {
				if(iteration.eduId !== '' && iteration.eduId !== undefined) {
					this.db.query('INSERT INTO UtdanningLink SET utdanningId = :eduId, cvId = :cvMainId', iteration);
				}
				if (iteration.cvExperience !== '' && iteration.cvExperience !== undefined){
					this.db.query('INSERT INTO ReferanseLink SET referanseId = :cvExperienceId, cvId = :cvMainId', iteration);
				}
			}
		}
	}
};
/* Sletter koblinger i CVen */
cv.prototype.removes = function(author, cvObj) {
	for(var i = 0; i < cvObj.length; i++) {
		var iteration = cvObj[i];
		if (iteration.user !== '' && iteration.user !== undefined) {
			if (iteration.cvMainId !== '' && iteration.cvMainId !== undefined) {
				this.db.query('REMOVE FROM TeknologiLink WHERE cvId = :cvMainId', iteration);
				this.db.query('REMOVE FROM ReferanseLink WHERE cvId = :cvMainId', iteration);
				this.db.query('REMOVE FROM UtdanningLink WHERE cvId = :cvMainId', iteration);
				this.db.query('REMOVE FROM Cv WHERE cvID = :cvMainId AND brukerID = :user', iteration);
			}
			if (iteration.cvExperienceId !== '' && iteration.cvExperienceId !== undefined) {
				this.db.query('REMOVE FROM TeknologiLink WHERE referanseId = :cvExperienceId', iteration);
				this.db.query('REMOVE FROM ReferanseLink WHERE referanseId = :cvExperienceId', iteration);
				this.db.query('REMOVE FROM Referanser WHERE referanseId = :cvExperienceId AND brukerId = :user', iteration);
			}
			if (iteration.eduId !== '' && iteration.eduId !== undefined) {
				this.db.query('REMOVE FROM UtdanningLink WHERE utdanningId = :eduId',iteration);
				this.db.query('REMOVE FROM Utdanning WHERE utdanningid = :eduId AND brukerId = :user', iteration);
			}
		}
	}
};
/* Oppdatere CV */
cv.prototype.updates = function(author, cvObj) {
	for(var i = 0; i < cvObj.length; i++) {
		var iteration  = cvObj[i];
		if(iteration.cvMain !== undefined) {
			if(iteration.cvMain.id !== '' && iteration.cvMain.id !== undefined) {
				var cvMain = iteration.cvMain;
				cvMain.user = iteration.user;
				this.db.query('UPDATE Cv SET endreatDato = NOW(), cvNavn = :cvName, cvIntroduksjonsText = :introTxt WHERE brukerID = :user AND cvID = :id', cvMain);
				if(cvMain.cvTags !== undefined) {
					this.db.query('REMOVE FROM TeknologiLink WHERE cvId = :id', cvMain);
					for (var l = 0; l < cvMain.cvTags.length; l++) {
						this.db.query('INSERT INTO TeknologiLink SET ?', {cvId : cvMain.id, teknologiId:cvMain.cvTags[l]});
					}
				}
			}
		}
		if(iteration.cvExperiences !== undefined) {
			if(iteration.cvExperience.id !== '' && iteration.cvExperience.id !== undefined) {
				var cvReferance = iteration.cvExperience;
				cvReferance.user = iteration.user;
				this.db.query('UPDATE Referanser SET referanseRolle = :role, kundeId = :client, tidFra = :from, tidTil = :to, referanseTekst = :body WHERE brukerId = :user AND referanseId = :id', cvReferance);
				if (cvReferance !== undefined){
					this.db.query('REMOVE FROM TeknologiLink WHERE teknologiId = :id', cvReferance);
					for(var m = 0; m < cvReferance.cvTags.length; m++) {
						this.db.query('INSERT INTO TeknologiLink SET ?', {referanseId : cvReferance.id, teknologiId:cvReferance.cvTags[m]});
					}
				}
			}
		}
		if(iteration.edu !== undefined) {
			if(iteration.edu.id !== '' && iteration.edu.id !== undefined) {
				var edu = iteration.edu;
				edu.user = iteration.user;
				this.db.query('UPDATE Utdanning SET utdanningSted = :sted, utdanningGrad = :grad WHERE utdanningid = :id AND brukerId = :user', edu);
			}
		}
	}
};
/* Legger inn CV i databasen */
cv.prototype.cvInserts = function(author, cvObj) {
	// iterate through new elements
	for(var i = 0; i < cvObj.length; i++) {
		this.user = cvObj[i].user;
		if(cvObj[i].mainCv.cvNavn !== '' && cvObj[i].mainCv.introTxt !== '' && cvObj[i].mainCv.cvTags.length !== 0) {
			var cvTags = cvObj[i].mainCv.cvTags;
			this.db.query('INSERT INTO Cv SET ?', {/*createdBy: author,*/
				brukerId: cvObj[i].user,
				cvIntroduksjon : cvObj[i].mainCv.introTxt,
				cvNavn: cvObj[i].mainCv.cvName}, function (err, result) {
				for (var l = 0; l < cvTags.length; l++) {
					this.db.query('INSERT INTO TeknologiLink SET ?', {cvId: result.insertId, teknologiId: cvTags[l]});
				}
			});
		}
		if(cvObj[i].edu.sted !== '' && cvObj[i].edu.grad !== ''){
			this.db.query('INSERT INTO Utdanning SET ?', {
				brukerId : this.user,
				utdanningSted : cvObj[i].edu.sted,
				utdanningGrad : cvObj[i].edu.grad
			});
		}
		if (cvObj[i].cvExperience.role !== '' && cvObj[i].cvExperience.client !== '' && cvObj[i].cvExperience.from !== '' &&
				cvObj[i].cvExperience.to !== '' && cvObj[i].cvExperience.body !== '' && cvObj[i].cvExperience.tags.length !== 0){
			var ExpTags = cvObj[i].cvExperience.tags;
			this.db.query('INSERT INTO Referanser SET ?', {
					brukerId : this.user,
					referanseTekst : cvObj[i].cvExperience.body,
					tidFra : cvObj[i].cvExperience.from,
					tidTil : cvObj[i].cvExperience.to,
					referanseRolle : cvObj[i].cvExperience.role,
					kundeId : cvObj[i].cvExperience.client
				}, function (err, result) {
					for (var m = 0; m < ExpTags.length; m++) {
						this.db.query('INSERT INTO TeknologiLink SET ?', {referanseId: result.insertId,
							teknologiId: ExpTags[m]});
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
    this.db.query("SELECT cvId, cvBrukerId cvNavn, cvOpprettetDato, cvEndretDato FROM Cv WHERE ? ORDER BY cvNavn ASC", {cvBrukerId: userId}, callback);
};
cv.prototype.getSingleCvData = function(callback) {
    this.db.query("SELECT cvId, cvIntroduksjon, cvNavn, brukerFornavn, brukerEtternavn, brukerEpost, brukerTelefon FROM Cv INNER JOIN Brukere ON Cv.cvBrukerId = Brukere.brukerId WHERE ?", {cvId: this.cvId}, callback);
};
cv.prototype.getUtdanningData = function(callback) {
    this.db.query("SELECT utdanningSted, utdanningGrad, utdanningTid FROM Utdanning INNER JOIN UtdanningLink ON Utdanning.utdanningId = UtdanningLink.utdanningLinkUtdanningId WHERE ?", {utdanningLinkCvId: this.cvId}, callback);
};
cv.prototype.getReferanseData = function(callback) {
    this.db.query("SELECT referanseId, referanseInformasjon, referanseTidFra, referanseTidTil, referanseRolle, kundeNavn FROM Referanser INNER JOIN Kunder ON Referanser.referanseKundeId = Kunder.kundeId INNER JOIN ReferanserLink ON ReferanserLink.referanseLinkReferanseId = Referanser.referanseId WHERE ?", {referanseLinkCvId: this.cvId}, callback);
};
cv.prototype.getReferanseTeknologiData = function(inClause, callback) {
    this.db.query("SELECT teknologiNavn, teknologiLinkReferanseId FROM TeknologiLink INNER JOIN Teknologier ON TeknologiLink.teknologiLinkTeknologiId = Teknologier.teknologiId WHERE teknologiLinkReferanseId IN(" + inClause + ")", {}, callback);
};
cv.prototype.getTeknologiData = function(callback) {
    this.db.query("SELECT teknologiNavn, teknologiKategoriNavn FROM Teknologier INNER JOIN TeknologiKategorier ON Teknologier.teknologiKategoriId = TeknologiKategorier.teknologiKategoriId INNER JOIN TeknologiLink ON Teknologier.teknologiId = TeknologiLink.teknologiLinkTeknologiId WHERE ?", {teknologiLinkCvId: this.cvId}, callback);
};
cv.prototype.getReferanseUserData = function(userId, callback) {
    this.db.query("SELECT referanseId, referanseInformasjon, referanseTidFra, referanseTidTil, referanseRolle, kundeNavn FROM Referanser INNER JOIN Kunder ON Referanser.referanseKundeId = Kunder.kundeId INNER JOIN ReferanserLink ON ReferanserLink.referanseLinkReferanseId = Referanser.referanseId WHERE ?", {referanseBrukerId: userId}, callback);
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
                  "LEFT JOIN ReferanserLink ON referanseLinkCvId = cvId " +
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