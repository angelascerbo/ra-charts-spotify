$( document ).ready(() => {
	$('#obtain-dj-charts').on('click', (e) => {
		e.preventDefault;
		$.ajax({
			url: '/ra-charts',
			type: 'GET'
		})
	})
});
