document.addEventListener('DOMContentLoaded', function () {
	var xml = new XMLHttpRequest();
	xml.onreadystatechange = function () {
		if(xml.readyState === 4 && xml.status === 200) {
			var result = JSON.parse(xml.responseText);
			parseCv(result);
		}
	}
	xml.open('GET', '/api/showCv/1', true);
	xml.send();
});
function parseCv(cv) {
	var userName = document.getElementById('name');
	var cvTitle = document.getElementById('title');
	var cvIntroduction = document.getElementById('introduction');
	var technologies = document.getElementById('technologies');
	var education = document.getElementById('education');
	var references = document.getElementById('references');
	userName.innerHTML = cv.brukerFornavn + ' ' + cv.brukerEtternavn;
	cvTitle.innerHTML = cv.cvNavn;
	cvIntroduction = cv.intro;
	var technologyCat = null;
	for(var i in cv.teknologier) {
		if(technologyCat != cv.teknologier[i].kategoriNavn) {
			var newH3 = document.createElement('h3');
			var newH3Text = document.createTextNode(cv.teknologier[i].kategoriNavn);
			newH3.appendChild(newH3Text);
			technologies.appendChild(newH3);
			var newP = document.createElement('p');
			var newPText = document.createTextNode(cv.teknologier[i].navn);
			newP.appendChild(newPText);
			technologies.appendChild(newP);
			technologyCat = cv.teknologier[i].kategoriNavn;
		} else {
			newP.innerHTML += ', ' + cv.teknologier[i].navn;
		}
	}
	for(var j in cv.utdanning) {
		var newP = document.createElement('p');
		var newPText = document.createTextNode(cv.utdanning[j].grad + ', ' + cv.utdanning[j].sted);
		newP.appendChild(newPText);
		education.appendChild(newP);
	}
	for(var k in cv.referanser) {
		if(cv.referanser[k] != null) {
			var newH4 = document.createElement('h4');
			var newH4Text = document.createTextNode(cv.referanser[k].rolle);
			var newP = document.createElement('p');
			var newPText = document.createTextNode(cv.referanser[k].navn);
			var newPReference = document.createElement('p');
			var newPReferenceText = document.createTextNode(cv.referanser[k].informasjon);
			var newPTechnology = document.createElement('p');
			var newPTechnologyText = document.createTextNode('Teknologier: ');
			newPTechnology.appendChild(newPTechnologyText);
	
			var teknologier = cv.referanser[k].teknologier;
			for(var l in teknologier) {
				if(l < teknologier.length - 1) {
					newPTechnology.innerHTML += teknologier[l].navn + ', ';
				} else {
					newPTechnology.innerHTML += teknologier[l].navn;
				}
			}
			newH4.appendChild(newH4Text);
			newP.appendChild(newPText);
			newPReference.appendChild(newPReferenceText);
			references.appendChild(newH4);
			references.appendChild(newP);
			references.appendChild(newPReference);
			references.appendChild(newPTechnology);
		}
	}
}