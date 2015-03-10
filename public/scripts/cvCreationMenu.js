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


// json object expected by server
var sendJson = JSON.parse('{"author":"","timestamp":"","createCv":[{"user":"","cvIntro":"","cvMain":[],"cvExperience":[{"title":"","client":"","time":{"from":"","to":""},"body":"","tags":[]}]}],"updateCV":[{"user":"","cvIntro":{"id":"","intro":""},"cvMain":{"id":"","main":[]},"cvExperience":{"id":"","title":"","time":{"from":"","to":""},"body":"","tags":[]}}],"deleteCv":[{"user":"","cvIntroId":"","cvMainId":"","cvExperienceId":""}],"assembleCv":[{"user":"","cvIntroID":"","cvMainId":"","cvExperienceId":[]}]}');

// temp vars for development 
var loginId = 'root';
var consultant = 'magnus';


// div for creating cv assets
var cvField = document.getElementById('cvAddField');

var currentView;
// create variables for buttons
var createCvMenu = document.getElementById('createCvMenu');
var createCvMenu = createCvMenu.getElementsByTagName('li');
var forsideTxt = {btn:createCvMenu[0], 
				  form:'intro', 
				  responseHandler : function(dom){ // handles recived dom from ajax call
					dom.getElementsByTagName('button')[0].addEventListener('click', function(e){
						sendJson.createCv[0].cvIntro = dom.getElementsByTagName('textarea')[0].value;
						sendJson.author = loginId;
						sendJson.createCv[0].user = consultant;
						postToServer(sendJson);
				 })}};
// WORK IN PROGRESS!!!
/*var hovedside = {btn:createCvMenu[1], 
				 form: 'mainpage',
				 responseHandler : function (dom) {
				 	dom.getElementsByTagName
				 
}};*/
var erfaringer = createCvMenu[2];


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

addBtnEvent(forsideTxt);
addBtnEvent(hovedside);

/*
*	form stuff
*/



