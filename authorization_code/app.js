/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var authConfig = require('./config');

var client_id = authConfig.CLIENT_ID; 
var client_secret = authConfig.CLIENT_SECRET; 
var redirect_uri = 'http://localhost:8888/callback'; // Redirect uri set here: https://developer.spotify.com/my-applications/

var spotifyController = require('./public/scripts/spotifyController')
var raController = require('./public/scripts/raController')

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

// refactor so callback route makes some data requests as get /ra-charts
app.get('/callback', spotifyController.initAuth);

// click "GET TRACKLIST" handles get request to /ra-charts  
// get request passes off to spotifyController
// spotifyController redirects client to /ra-charts endpoint with JSON data
app.use('/ra-charts', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  // res.writeHead('Authorization', 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')));
  next();
})

app.get('/ra-charts', raController.getRAData, spotifyController.getArtist);

app.get('/refresh_token', spotifyController.refreshToken);

console.log('Listening on 8888');
app.listen(8888);
