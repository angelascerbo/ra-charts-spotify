$( document ).ready(() => {
  let raChartsSource = $('#ra-charts-template').html(),
    raChartsTemplate = Handlebars.compile(raChartsSource),
    raChartsPlaceholder = $('#ra-charts');

	$('#obtain-dj-charts').on('click', (e) => {
		e.preventDefault;
		$.ajax({
			url: '/ra-charts',
			type: 'GET',
			success: function(response) {
				response.forEach((artist) => {
					let raChartContent = {
						name: artist.name
					}

					let compileTemplate = raChartsTemplate(raChartContent); 
	        raChartsPlaceholder.append(compileTemplate);	
				})
				
      }
		})
	})
});
