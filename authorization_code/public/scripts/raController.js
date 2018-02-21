const cheerio = require('cheerio');
const request = require('request');
const uri = 'https://www.residentadvisor.net/'

const raController = {
	getRAData: (req, res, next) => {
		let arrPromises = [];

		request(uri + 'dj-charts.aspx', (error, response, html) => {
      if(error) return console.error(error);

      let $ = cheerio.load(html);

      const chartUrls = [];
      const targets = $('.grid.nowidth.col4-6.small').find('article').children('a');
     
      $(targets).each((i, el) => {
      	chartUrls[i] = $(el).attr('href');
      	arrPromises.push(raController.scrapeCharts(chartUrls[i]));
      });

      Promise.all(arrPromises).then((data) => {
      	console.log(data)
        res.locals = data;
        next();
      });
    })
	},

	// scrapeCharts returns a promise of resolved data for each chart
	scrapeCharts: (chartUrl) => {
		//console.log('scrapeCharts url', chartUrl)
		return new Promise((resolve, reject) => {
			request(uri + chartUrl, (error, response, html) => {
      	if(error) return console.error(error);

      	let $ = cheerio.load(html);

      	const djName = $('#featureHead').find('h1').html();
      	//console.log(djName)
      	// return DJ name
      	return resolve(djName);
      })
		});
	}
}

module.exports = raController;