document.onDOMContentLoaded = function () {
	var xml = new xmlHTTPRequest();
	xml.onreadystatechange = function () {
		if(xml.readyState === 4 && xml.status === 200) {
			var result = JSON.parse(xml.responseText);
			parseUsers(result);
		}
	}
	xml.open('GET', '/api/showUsers/', true);
	xml.send();
}
function parseUsers(data) {
	var users = document.getElementById('users');
	users.innerHTML = '';
	if(data.length > 0) {
		for(var i in data) {
			var newP = document.createElement('p');
			var newA = document.createElement('a');
			newA.setAttribute('href', 'api/showUsersCv/' + data[i].brukerId);
			newA.addEventListener('click', showUserCvs);
			var newAText = document.createTextNode(data[i].brukerEtternavn + ', ' + data[i].brukerFornavn);
			newA.appendChild(newAText);
			newP.appendChild(newA);
			users.appendChild(newP);
		}
	} else {
		users.innerHTML = 'Ingen brukere';
	}
}
function showUserCvs() {
	var xml = new xmlHTTPRequest();
	xml.onreadystatechange = function () {
		if(xml.readyState === 4 && xml.status === 200) {
			var result = JSON.parse(xml.responseText);
			parseUsersCvs(result);
		}
	}
	xml.open('GET', this.href, true);
	xml.send();
}
function parseUserCvs(data) {
	var userCvs = document.getElementById('userResults');
	userCvs.innerHTML = '';
	if(data.length > 0) {
		for(var i in data) {
			var newP = document.createElement('p');
			var newA = document.createElement('a');
			newA.setAttribute('href', 'api/showCv/' + data[i].cvId);
			var newAText = document.createTextNode(data[i].cvNavn);
			newA.appendChild(newAText);
			newP.appendChild(newA);
			userCvs.appendChild(newP);
		}
	} else {
		userCvs.innerHTML = 'Ingen CVer';
	}
	
}