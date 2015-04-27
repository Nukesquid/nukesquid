document.addEventListener('DOMContentLoaded', function () {
	var xml = new XMLHttpRequest();
	xml.onreadystatechange = function () {
		if(xml.readyState === 4 && xml.status === 200) {
			var result = JSON.parse(xml.responseText);
			parseUsers(result);
		}
	}
	xml.open('GET', '/api/showUsers/', true);
	xml.send();
});
function parseUsers(data) {
	var users = document.getElementById('users');
	if(data.length > 0) {
		var newTbody = document.createElement('tbody');
		for(var i in data) {
			var newTr = document.createElement('tr');
			var tdEtternavn = document.createElement('td');
			var tdFornavn = document.createElement('td');
			var tdEpost = document.createElement('td');
			var tdTelefon = document.createElement('td');
			var newAEtternavn = document.createElement('a');
			var newAFornavn = document.createElement('a');
			newAEtternavn.setAttribute('href', '/api/showUsersCv/' + data[i].brukerId);
			newAFornavn.setAttribute('href', '/api/showUsersCv/' + data[i].brukerId);
			newAEtternavn.addEventListener('click', function (e) {
				showUserCvs(this.href, e);
			});
			newAFornavn.addEventListener('click', function (e) {
				showUserCvs(this.href, e);
			});
			var newAEtternavnText = document.createTextNode(data[i].brukerEtternavn);
			var newAFornavnText = document.createTextNode(data[i].brukerFornavn);
			var tdEpostText = document.createTextNode(data[i].brukerEpost);
			var tdTelefonText = document.createTextNode(data[i].brukerTelefon);
			newAEtternavn.appendChild(newAEtternavnText);
			newAFornavn.appendChild(newAFornavnText);
			tdEtternavn.appendChild(newAEtternavn);
			tdFornavn.appendChild(newAFornavn);
			tdEpost.appendChild(tdEpostText);
			tdTelefon.appendChild(tdTelefonText);
			newTr.appendChild(tdEtternavn);
			newTr.appendChild(tdFornavn);
			newTr.appendChild(tdEpost);
			newTr.appendChild(tdTelefon);
			newTbody.appendChild(newTr);
			users.appendChild(newTbody);
		}
	} else {
		users.innerHTML = 'Ingen brukere';
	}
}
function showUserCvs(href, e) {
	var xml = new XMLHttpRequest();
	xml.onreadystatechange = function () {
		if(xml.readyState === 4 && xml.status === 200) {
			var result = JSON.parse(xml.responseText);
			parseUserCvs(result);
		}
	}
	xml.open('GET', href, true);
	xml.send();
	e.preventDefault();
}
function parseUserCvs(data) {
	var userCvs = document.getElementById('userResults');
	if(data.length > 0) {
		userCvs.innerHTML = '';
		var newTable = document.createElement('table');
		newTable.setAttribute('class', 'panel table-bordered textbox-model2');
		var newThead = document.createElement('thead');
		var newTrHead = document.createElement('tr');
		var newThNavn = document.createElement('th');
		var newThDato = document.createElement('th');
		var newThEndret = document.createElement('th');
		var newThNavnText = document.createTextNode('Tittel');
		var newThDatoText = document.createTextNode('Opprettet');
		var newThEndretText = document.createTextNode('Siste endret');
		newThNavn.appendChild(newThNavnText);
		newThDato.appendChild(newThDatoText);
		newThEndret.appendChild(newThEndretText);
		newTrHead.appendChild(newThNavn);
		newTrHead.appendChild(newThDato);
		newTrHead.appendChild(newThEndret);
		newThead.appendChild(newTrHead);
		newTable.appendChild(newThead);
		var newTbody = document.createElement('tbody');
		for(var i in data) {
			var newTr = document.createElement('tr');
			var newTdNavn = document.createElement('td');
			var newTdDato = document.createElement('td');
			var newTdEndret = document.createElement('td');
			var newA = document.createElement('a');
			newA.setAttribute('href', '/showCv/' + data[i].cvId);
			var newAText = document.createTextNode(data[i].cvNavn);
			var newTdDatoText = document.createTextNode(data[i].cvOpprettetDato);
			var newTdEndretText = document.createTextNode(data[i].cvEndretDato);
			newA.appendChild(newAText);
			newTdNavn.appendChild(newA);
			newTdDato.appendChild(newTdDatoText);
			newTdEndret.appendChild(newTdEndretText);
			newTr.appendChild(newTdNavn);
			newTr.appendChild(newTdDato);
			newTr.appendChild(newTdEndret);
			newTbody.appendChild(newTr);
		}
		newTable.appendChild(newTbody);
		userCvs.appendChild(newTable);
	} else {
		userCvs.innerHTML = 'Ingen CVer';
	}	
}