document.onDOMContentLoaded = function () {
	document.getElementById('searchSubmit').addEventListener(function () {
		var xml = new xmlHTTPRequest();
		xml.onreadystatechange = function () {
			if(xml.readyState === 1) {
				document.getElementById('searchSubmit').value = "S�ker";
				document.getElementById('searchSubmit').disabled = true;
			} else if(xml.readyState === 4 && xml.status === 200) {
				var result = JSON.parse(xml.responseText);
				parseSearch(result);
				document.getElementById('searchSubmit').value = "S�k";
				document.getElementById('searchSubmit').disabled = false;
			}
		}
		xml.open('GET', '/api/search/' + document.getElementById('searchPhrase'), true);
		xml.send();
	});	
}
function parseSearch(data) {
	var searchResults = document.getElementById('searchResults');
	searchResults.innerHTML = '';
	if(data.length > 0) {
		for(var i in data) {
			var newP = document.createElement('p');
			var newA = document.createElement('a');
			newA.setAttribute('href', 'api/showCv/' + data[i].cvId);
			var newAText = document.createTextNode(data[i].cvNavn);
			newA.appendChild(newAText);
			newP.appendChild(newA);
			searchResults.appendChild(newP);
		}
	} else {
		searchResults.innerHTML = 'Ingen treff';
	}
}