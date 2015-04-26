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
	users.innerHTML = '';
	if(data.length > 0) {
		for(var i in data) {
			var newP = document.createElement('p');
			var newA = document.createElement('a');
			newA.setAttribute('href', '/api/showUsersCv/' + data[i].brukerId);
			newA.addEventListener('click', function (e) {
				showUserCvs('api/showUsersCv/' + data[i].brukerId, e);
			});
			var newAText = document.createTextNode(data[i].brukerEtternavn + ', ' + data[i].brukerFornavn);
			newA.appendChild(newAText);
			newP.appendChild(newA);
			users.appendChild(newP);
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
	userCvs.innerHTML = '';
	if(data.length > 0) {
		for(var i in data) {
			var newP = document.createElement('p');
			var newA = document.createElement('a');
			newA.setAttribute('href', '/showCv/' + data[i].cvId);
			var newAText = document.createTextNode(data[i].cvNavn);
			newA.appendChild(newAText);
			newP.appendChild(newA);
			userCvs.appendChild(newP);
		}
	} else {
		userCvs.innerHTML = 'Ingen CVer';
	}
	
}