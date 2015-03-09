// div for creating cv assets
var cvField = document.getElementById('cvAddField');


// create variables for buttons
var createCvMenu = document.getElementById('createCvMenu');
var createCvMenu = createCvMenu.getElementsByTagName('li');
var forsideTxt = {btn:createCvMenu[0], form:'intro'};
var hovedside = {btn:createCvMenu[1], form: 'mainpage'};
var erfaringer = createCvMenu[2];

// the getter of forms
function getCreateCvElement(formToGet, containerElement){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			containerElement.innerHTML = xmlhttp.responseText;
    	}
	}	
	xmlhttp.open('GET', '/createcv/' + formToGet, true);
	xmlhttp.send();
	return xmlhttp.responseText
}

// function for cvBtns
var addBtnEvent = function(obj){
	this.obj = obj;
	obj.btn.addEventListener('click', function(e){
		getCreateCvElement(obj.form, cvField);
	});
}

addBtnEvent(forsideTxt);
addBtnEvent(hovedside);



