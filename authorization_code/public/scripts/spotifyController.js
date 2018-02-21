const Spotify = require('spotify-api-client');

const spotifyController = {
  getArtist: (req, res, next) => {
    Spotify.findArtist('The Beatles')
      .then((json) => {
        res.status(200).send(json)
      })
      .catch((err) => {
        console.log(err)
        res.status(404).send('Error')
      })
  }
}

module.exports = spotifyController;