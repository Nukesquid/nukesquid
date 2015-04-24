document.onDOMContentLoaded = function () {
	var xml = new xmlHTTPRequest();
	xml.onreadystatechange = function () {
		if(xml.readyState === 4 && xml.status === 200) {
			var result = JSON.parse(xml.responseText);
			parseCv(result);
		}
	}
	xml.open('GET', '/api/showCv/1', true);
	xml.send();
}
function parseCv(cv) {
	var userName = document.getElementById('name');
	var cvTitle = document.getElementById('title');
	var cvIntroduction = document.getElementById('introduction');
	var technologies = document.getElementById('technologies');
	var education = document.getElementById('education');
	var references = document.getElementById('references');
	userName.innerHTML = cv.brukerForavn + ' ' + cv.brukerEtternavn;
	cvTitle.innerHTML = cv.cvNavn;
	cvIntroduction = cv.cvIntroduksjon;
	var technologyCat = null;
	for(var i in cv.teknologier) {
		if(techologyCat != cv.teknologier[i].kategoriNavn) {
			var newH3 = document.createElement('h3');
			var newH3Text = document.createTextNode(cv.teknologier[i].kategoriNavn);
			newH3.appendChild(newH3Text);
			technologies.appendChild(newH3);
			var newP = document.createElement('p');
			var newPText = document.createTextNode(cv.teknologier[i].navn);
			newP.appendChild(newPText);
			technologies.appendChild(newP);
		} else {
			newP.innerHTML += ', ' + cv.teknologier[i].navn;
		}
	}
	for(var j in cv.utdanning) {
		
	}
}