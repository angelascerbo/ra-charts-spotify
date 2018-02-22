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
        //console.log('allPromises in RA', JSON.stringify(data, null, 4))
        res.locals = data;
        next();
      });
    })
  },

  // scrapeCharts returns a promise of resolved data for each chart
  scrapeCharts: (chartUrl) => {
    return new Promise((resolve, reject) => {
      request(uri + chartUrl, (error, response, html) => {
        if(error) return console.error(error);

        let $ = cheerio.load(html);
        const djObj = {};
        djObj.tracksByArtist = {};
        djObj.tracks = []; 

        const djName = $('#featureHead').find('h1').html();
        djObj['dj_name'] = djName;

        $('#tracks li').each((i, el) => {
          let artist = $(el).children('.artist');
          let title = $(el).children('.track');
          $(title).find('br').replaceWith(' ');

          if ($(artist).children('a').length) {
            artist =  $(artist).children().html();
          } else {
            artist = $(artist).html();
          }

          if ($(title).children('a').length) {
            title =  $(title).children().html();
          } else {
            title = $(title).html();
          }

          // if artist exists in tracks, push track title to array 
          if (djObj.tracksByArtist[artist]) {
            djObj.tracksByArtist[artist].push(title);
          } else {
            // else create a new artist property in tracks
            djObj.tracksByArtist[artist] = [];
            djObj.tracksByArtist[artist].push(title);
          }

          djObj.tracks.push(title);
        })

        return resolve(djObj);
      })
    });
  }
}

module.exports = raController;