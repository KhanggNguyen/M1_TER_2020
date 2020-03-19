$(document).ready(function(){
	var element = $('meta[name="active-menu"]').attr('content');
	$('#' + element).addClass('active');
	$('ul li a').click(function(){
		$('li a').removeClass("active");
		var element = $('meta[name="active-menu"]').attr('content');
		console.log(element);
		$("#" + element).addClass("active");
	});

});