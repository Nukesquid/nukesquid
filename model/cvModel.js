var cv = function (db) {
    var super_ = this;
    this.db = db;
    this.jsonOut = {};
    this.cvId = null;
}
cv.prototype.showSingleCv = function(req, res, cvId) {
    var super_ = this;
    this.getSingeCvJSON(cvId, function () {
        res.json(super_.jsonOut);
    });
}
cv.prototype.showUserCv = function(req, res, userId) {
    var super_ = this;
    this.getUserCv(userId, function (rows) {
        for(var i = 0; i < rows.length; i++) {
            super_.jsonOut.push({
                cvId: rows[i].cvId,
                cvNavn: rows[i].cvNavn
            });
        }
        res.json(super_.jsonOut);
    })
}
cv.prototype.showTeknologier = function(req, res) {
    var super_ = this;
    this.getTeknologier(function (rows) {
        for(var i = 0; i < rows.length; i++) {
      //      if(typeof super_.jsonOut[rows[i].teknologiKategoriNavn] == undefined) {
                super_.jsonOut.push(rows[i].teknologiKategoriNavn);
    //        } else {
         /*   super_.jsonOut[rows[i].teknologiKategoriNavn].push({
                teknologiId: rows[i].teknologiId,
                teknologiNavn: rows[i].teknologiNavn
            }); */
      //      }
        }
        res.json(super_.jsonOut);
    })
}
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
                for(var i = 0; i < cvTeknologiData.length; i++) {
                    inClause += cvTeknologiData[i];
                    inClause += (i == cvTeknologiData.length -1) ? '' : ',';
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
}
cv.prototype.getTeknologier = function (callback) {
    this.db.query("SELECT teknologiId, teknologiNavn, teknologiKategoriNavn FROM Teknologier INNER JOIN TeknologiKategorier ON TeknologiKategorier.teknologiKategoriId = Teknologier.teknologiKategoriId ORDER BY teknologiKategoriNavn ASC", {}, callback);
}
cv.prototype.getUserCv = function (userId, callback) {
    this.db.query("SELECT cvId, cvNavn FROM Cv WHERE ?", {cvBrukerId: userId}, callback);
}
cv.prototype.getSingleCvData = function(callback) {
    this.db.query("SELECT cvId, cvIntroduksjon, cvNavn, brukerFornavn, brukerEtternavn, brukerEpost, brukerTelefon FROM Cv INNER JOIN Brukere ON Cv.cvBrukerId = Brukere.brukerId WHERE ?", {cvId: this.cvId}, callback);
}
cv.prototype.getUtdanningData = function(callback) {
    this.db.query("SELECT utdanningSted, utdanningGrad, utdanningTid FROM Utdanning INNER JOIN UtdanningLink ON Utdanning.utdanningId = UtdanningLink.utdanningLinkUtdanningId WHERE ?", {utdanningLinkCvId: this.cvId}, callback);
}
cv.prototype.getReferanseData = function(callback) {
    this.db.query("SELECT referanseId, referanseInformasjon, referanseTidFra, referanseTidTil, referanseRolle, kundeNavn FROM Referanser INNER JOIN Kunder ON Referanser.referanseKundeId = Kunder.kundeId INNER JOIN ReferanserLink ON ReferanserLink.referanseLinkReferanseId = Referanser.referanseId WHERE ?", {referanseLinkCvId: this.cvId}, callback);
}
cv.prototype.getReferanseTeknologiData = function(inClause, callback) {
    this.db.query("SELECT teknologiNavn, teknologiLinkReferanseId FROM TeknologiLink INNER JOIN Teknologier ON TeknologiLink.teknologiLinkTeknologiId = Teknologier.teknologiId WHERE teknologiLinkReferanseId IN(" + inClause + ")", {}, callback);
}
cv.prototype.getTeknologiData = function(callback) {
    this.db.query("SELECT teknologiNavn, teknologiKategoriNavn FROM Teknologier INNER JOIN TeknologiKategorier ON Teknologier.teknologiKategoriId = TeknologiKategorier.teknologiKategoriId INNER JOIN TeknologiLink ON Teknologier.teknologiId = TeknologiLink.teknologiLinkTeknologiId WHERE ?", {teknologiLinkCvId: this.cvId}, callback);
}
module.exports = cv;
