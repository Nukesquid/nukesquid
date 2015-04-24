// the getter of forms
function multipurposeGetter(url, callback, containerElement){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			if (typeof containerElement !== 'undefined'){
				containerElement.innerHTML = xmlhttp.responseText;
				callback(containerElement);
			}else {
				callback(xmlhttp.responseText);
			}
    	}
	}	
	xmlhttp.open('GET', url, true);
	xmlhttp.send();
}
// send data to server
function postToServer(json){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('POST', '/controller', true);
	xmlhttp.setRequestHeader('Content-type', 'application/json');
	xmlhttp.send(JSON.stringify(json));
}

// function for cvBtns
var addBtnEvent = function(obj){
	this.obj = obj;
	obj.btn.addEventListener('click', function(e){
		if (currentView != obj.url){
			currentView = obj.url;
			multipurposeGetter(obj.url, obj.responseHandler, cvField);
		}
	});
}

// get konsulentliste og legg i boks
function leggKonsulentISelectBox(dom){
	this.callback = function(req) {
		this.selectBox = dom.getElementsByTagName('select')[0];
		this.konsulenter = JSON.parse(req);
		if(typeof this.konsulenter === 'object'){
			for (var i=0;i<this.konsulenter.length; i++){
				this.option = document.createElement('option');
				this.option.innerHTML = this.konsulenter[i].brukerFornavn + ' ' + this.konsulenter[i].brukerEtternavn;
				this.option.value = this.konsulenter[i].brukerId;
				this.selectBox.appendChild(this.option);
			}
		}
	}
	multipurposeGetter('/api/showusers/', this.callback);

}

// get taglist from server
function getTags() {
	// placeholder until henrik developes serverside api
	var tempReturnObjs = [{tagId : 1,
						   tagName : 'JavaScript',
						   tagCategoryId : 2,
						   tagCategoryName : 'Utviklingsspråk og rammeverk'},
						  {tagId : 2,
						   tagName : 'Pølsevev',
						   tagCategoryId : '1',
						   tagCategoryName : 'Spesial skills'}
						  ];
	return tempReturnObjs;
}

// functions end

// json object expected by server
var sendJson = JSON.parse('{"author":"","timestamp":"","createUser":[{"brukerFornavn":"","brukerEtternavn":"","brukerEpost":"","brukerTelefon":""}],"createCv":[{"brukerId":"","mainCv":{"cvNavn":"","cvIntroduksjon":"","cvTags":[]},"edu":{"utdanningSted":"","utdanningGrad":""},"cvExperience":{"referanseRolle":"","referanseKundeId":"","referanseTidFra":"","referanseTidTil":"","referanseInformasjon":"","tags":[]}}],"updateCv":[{"brukerId":"","cvMain":{"cvId":"","cvNavn":"","cvIntroduksjon":"","cvTags":[]},"cvExperience":{"referanseId":"","referanseRolle":"","referanseKundeId":"","referanseTidFra":"","referanseTidTil":"","referanseInformasjon":"","cvTags":[]},"edu":{"utdanningId":"","utdanningSted":"","utdanningGrad":""}}],"deleteCv":[{"brukerId":"","utdanningId":"","cvId":"","referanseId":""}],"assembleCv":[{"brukerId":"","utdanningId":[],"cvId":"","referanseId":[]}]}');

// temp vars for development 
var loginId = '3';
var consultant = '1';


// div for creating cv assets
var cvField = document.getElementById('cvAddField');

var currentView;
// create variables for buttons
var createCvMenu = document.getElementById('createCvMenu');
var createCvMenu = createCvMenu.getElementsByTagName('li');
// create introForm
var hovedSide = {btn:createCvMenu[0], 
				  url:'/createcv/main', 
				  responseHandler : function(dom){ // callback for ajax
					//write all tags til list
					leggKonsulentISelectBox(dom);
				 	var list = dom.getElementsByTagName('ul')[0];
					var tags = getTags();
					for (i=0; i<tags.length;i++){
						var listElement = document.createElement('li');
						var checkbox = document.createElement('input');
						checkbox.type = 'checkbox';
						checkbox.value = tags[i].tagId;
						listElement.appendChild(checkbox);
						listElement.innerHTML += ' ' + tags[i].tagName + ' | ' + tags[i].tagCategoryName;
						list.appendChild(listElement);
					}
					dom.getElementsByTagName('button')[0].addEventListener('click', function(e){
						sendJson.createCv[0].mainCv.cvNavn = dom.getElementsByTagName('input')[0].value;
						sendJson.createCv[0].mainCv.cvIntroduksjon = dom.getElementsByTagName('textarea')[0].value;
						sendJson.author = loginId;
						sendJson.createCv[0].brukerId = dom.getElementsByTagName('select')[0].options[dom.getElementsByTagName('select')[0].selectedIndex].value;
						// place tags in json
						var listElements = list.childNodes;
						for (i=0;i<listElements.length;i++){
							var checkbox = listElements[i].getElementsByTagName('input')[0];
							if (checkbox.checked){
								sendJson.createCv[0].mainCv.cvTags[sendJson.createCv[0].mainCv.cvTags.length] = checkbox.value;
							}
						}
						postToServer(sendJson);
				 })}};
// WORK IN PROGRESS!!!
var utdanning = {btn:createCvMenu[1], 
				 url: '/createcv/edu',
				 responseHandler : function (dom) {
					// place selected items in sendJson	
					leggKonsulentISelectBox(dom);
					dom.getElementsByTagName('button')[0].addEventListener('click', function(e){
						sendJson.author = loginId;
						sendJson.createCv[0].brukerId = dom.getElementsByTagName('select')[0].options[dom.getElementsByTagName('select')[0].selectedIndex].value;
						var inputs = dom.getElementsByTagName('input');
						sendJson.createCv[0].edu.utdanningGrad = inputs[0].value						
						sendJson.createCv[0].edu.utdanningSted = inputs[1].value;
						postToServer(sendJson);
					})}};
var erfaringer = {btn : createCvMenu[2],
				  url : '/createcv/experiences',
				  responseHandler : function(dom) {
					//write all tags to list
					leggKonsulentISelectBox(dom);
				 	var list = dom.getElementsByTagName('ul')[0];
					var tags = getTags();
					for (i=0; i<tags.length;i++){
						var listElement = document.createElement('li');
						var checkbox = document.createElement('input');
						checkbox.type = 'checkbox';
						checkbox.value = tags[i].tagId;
						listElement.appendChild(checkbox);
						listElement.innerHTML += ' ' + tags[i].tagName + ' | ' + tags[i].tagCategoryName;
						list.appendChild(listElement);
					}
					dom.getElementsByTagName('button')[0].addEventListener('click', function(e){
						var inputs = dom.getElementsByTagName('input');
						sendJson.author = loginId;
						sendJson.createCv[0].brukerId = dom.getElementsByTagName('select')[0].options[dom.getElementsByTagName('select')[0].selectedIndex].value;
						sendJson.createCv[0].cvExperience.referanseRolle = inputs[0].value;
						sendJson.createCv[0].cvExperience.referanseKundeId = inputs[1].value;
 						sendJson.createCv[0].cvExperience.referanseTidFra = inputs[2].value;
						sendJson.createCv[0].cvExperience.referanseTidTil = inputs[3].value;
						sendJson.createCv[0].cvExperience.referanseInformasjon = dom.getElementsByTagName('textarea')[0].value;
						// add tags
						var listElements = list.childNodes;
						for (i=0;i<listElements.length;i++){
							var checkbox = listElements[i].getElementsByTagName('input')[0];
							if (checkbox.checked){
								sendJson.createCv[0].cvExperience.tags[sendJson.createCv[0].cvExperience.tags.length] = checkbox.value;
							}
						}
						console.log(sendJson);
						postToServer(sendJson);
					})}};

// createCvmenu functionality
addBtnEvent(hovedSide);
addBtnEvent(utdanning);
addBtnEvent(erfaringer);

/*
*	form stuff
*/



