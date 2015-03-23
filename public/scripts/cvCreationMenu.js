// the getter of forms
function getCreateCvElement(formToGet, containerElement, responseHandling){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			containerElement.innerHTML = xmlhttp.responseText;
			if (typeof responseHandling !== 'undefined'){
				responseHandling(containerElement);
			}
    	}
	}	
	xmlhttp.open('GET', '/createcv/' + formToGet, true);
	xmlhttp.send();
	return xmlhttp.responseText
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
		if (currentView != obj.form){
			currentView = obj.form;
			getCreateCvElement(obj.form, cvField, obj.responseHandler);
		}
	});
}

// get taglist from server
function getTags() {
	// placeholder until henrik developes serverside api
	var tempReturnObjs = [{tagId : 1,
						   tagName : 'JavaScript',
						   tagCategoryId : 1,
						   tagCategoryName : 'Utviklingsspråk og rammeverk'},
						  {tagId : 2,
						   tagName : 'Pølsevev',
						   tagCategoryId : '2',
						   tagCategoryName : 'Spesial skills'}
						  ];
	return tempReturnObjs;
}

// functions end

// json object expected by server
var sendJson = JSON.parse('{"author":"","timestamp":"","createCv":[{"user":"","mainCv":{"cvNavn":"","introTxt":"","cvTags":[]},"edu":{"sted":"","grad":""},"cvExperience":{"role":"","client":"","from":"","to":"","body":"","tags":[]}}],"updateCV":[{"user":"","cvIntro":{"id":"","intro":""},"cvMain":{"id":"","main":[]},"cvExperience":{"id":"","title":"","client":"","time":{"from":"","to":""},"body":"","tags":[]}}],"deleteCv":[{"user":"","cvIntroId":"","cvMainId":"","cvExperienceId":""}],"assembleCv":[{"user":"","cvIntroID":"","cvMainId":"","cvExperienceId":[]}]}');

// temp vars for development 
var loginId = 'root';
var consultant = 'magnus';


// div for creating cv assets
var cvField = document.getElementById('cvAddField');

var currentView;
// create variables for buttons
var createCvMenu = document.getElementById('createCvMenu');
var createCvMenu = createCvMenu.getElementsByTagName('li');
// create introForm
var hovedSide = {btn:createCvMenu[0], 
				  form:'main', 
				  responseHandler : function(dom){ // handles recived dom from ajax call
					//write all tags til list
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
						sendJson.createCv[0].mainCv.cvName = dom.getElementsByTagName('input')[0].value;
						sendJson.createCv[0].mainCv.introTxt = dom.getElementsByTagName('textarea')[0].value;
						sendJson.author = loginId;
						sendJson.createCv[0].user = consultant;
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
				 form: 'edu',
				 responseHandler : function (dom) {
					// place selected items in sendJson	
					dom.getElementsByTagName('button')[0].addEventListener('click', function(e){
						sendJson.author = loginId;
						sendJson.createCv[0].user = consultant;
						var inputs = dom.getElementsByTagName('input');
						sendJson.createCv[0].edu.grad = inputs[0].value						
						sendJson.createCv[0].edu.sted = inputs[1].value;
						postToServer(sendJson);
					})}};
var erfaringer = {btn : createCvMenu[2],
				  form : 'experiences',
				  responseHandler : function(dom) {
					//write all tags til list
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
						sendJson.createCv[0].user = consultant;
						sendJson.createCv[0].cvExperience.role = inputs[0].value;
						sendJson.createCv[0].cvExperience.client = inputs[1].value;
 						sendJson.createCv[0].cvExperience.from = inputs[2].value;
						sendJson.createCv[0].cvExperience.to = inputs[3].value;
						sendJson.createCv[0].cvExperience.body = dom.getElementsByTagName('textarea')[0].value;
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



