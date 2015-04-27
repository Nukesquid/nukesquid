
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


var userTable = document.getElementsByTagName('table')[0];
multipurposeGetter('/api/showusers', function(req){
	this.users = JSON.parse(req);
	for(var i = 0;i<this.users.length;i++) {
		this.tr = document.createElement('tr');
		for (this.element in this.users[i]){
			this.td = document.createElement('td');
			this.a = document.createElement('a');
			this.a.href = '/cvliste/'+this.users[i].brukerId;
			this.a.innerHTML = this.users[i][this.element];
			this.td.appendChild(a);
			this.tr.appendChild(this.td);
		}
		userTable.appendChild(tr);
	}
});