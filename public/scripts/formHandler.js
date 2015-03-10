var sendJson = JSON.parse('{"author":"","timestamp":"","createcv":[{"user":"","cvIntro":"","cvMain":[],"cvExperience":[{"title":"","client":"","time":{"from":"","to":""},"body":"","tags":[]}]}],"updateCV":[{"user":"","cvIntro":{"id":"","intro":""},"cvMain":{"id":"","main":[]},"cvExperience":{"id":"","title":"","time":{"from":"","to":""},"body":"","tags":[]}}],"deleteCv":[{"user":"","cvIntroId":"","cvMainId":"","cvExperienceId":""}],"assembleCv":[{"user":"","cvIntroID":"","cvMainId":"","cvExperienceId":[]}]}');

var form = document.getElemetsById('cvAddField');

if (form.id == 'cvIntro'){
	var introTxt = form.getElementsByTagName('textarea')[0];
	var submitBtn = form.getElementsByTagName('button')[0];	
	sendJson.createcv[0].cvIntro = introTxt;
	submitBtn.addEventListener('click', function(e){
		sendJson.createcv[0].cvIntro = introTxt;
		console.log(sendJson);
	});
}
