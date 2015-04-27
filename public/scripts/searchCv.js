document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('searchForm').addEventListener('submit', function (e) {
		var xml = new XMLHttpRequest();
		xml.onreadystatechange = function () {
			if(xml.readyState === 1) {
				document.getElementById('searchSubmit').value = "Søker";
				document.getElementById('searchSubmit').disabled = true;
			} else if(xml.readyState === 4 && xml.status === 200) {
				var result = JSON.parse(xml.responseText);
				parseSearch(result);
				document.getElementById('searchSubmit').value = "Søk";
				document.getElementById('searchSubmit').disabled = false;
			}
		}
		xml.open('GET', '/api/search/' + document.getElementById('searchPhrase').value, true);
		xml.send();
		e.preventDefault();
	});	
});
function parseSearch(data) {
	var searchResults = document.getElementById('searchResults');
	searchResults.innerHTML = '';
	if(data.length > 0) {
		searchResults.innerHTML = '';
		var newTable = document.createElement('table');
		newTable.setAttribute('class', 'panel table-bordered textbox-model2');
		var newThead = document.createElement('thead');
		var newTrHead = document.createElement('tr');
		var newThNavn = document.createElement('th');
		var newThDato = document.createElement('th');
		var newThEndret = document.createElement('th');
		var newThNavnText = document.createTextNode('Tittel');
		var newThDatoText = document.createTextNode('Bruker');
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
			var newTdDatoText = document.createTextNode(data[i].brukerEtternavn + ', ' + data[i].brukerFornavn);
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
		searchResults.appendChild(newTable);
	} else {
		var newPNoHits = document.createElement('p');
		var newPNoHitsText = document.createTextNode('Ingen treff.');
		newPNoHits.appendChild(newPNoHitsText);
		newPNoHits.setAttribute('class', 'panel table-bordered textbox-model2');
		newPNoHits.setAttribute('style', 'border: solid 1px #000');
		searchResults.appendChild(newPNoHits);
	}
}