const request = require('request'); 
const querystring = require('querystring');
const fetch = require('isomorphic-fetch');
const redirect_uri = 'http://localhost:8888/callback'; // Redirect uri set here: https://developer.spotify.com/my-applications/
const stateKey = 'spotify_auth_state';
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, './../config.json');

// read the file which returns a buffer
// parse it to get an object and access properties
const authConfig = JSON.parse(fs.readFileSync(configPath));
const client_id = authConfig.CLIENT_ID; 
const client_secret = authConfig.CLIENT_SECRET; 
const BASE_URL = 'https://api.spotify.com/v1/search?';

const spotifyController = {
  initAuth: (req, res) => {
    // your application requests refresh and access tokens
    // after checking the state parameter
    console.log('initAuth')
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      res.clearCookie(stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };

      // make a post request w/ form to Spotify, which returns response with access and refresh token
      // these token authorize the client (browser / user) to make API requests
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {

          var access_token = body.access_token,
              refresh_token = body.refresh_token;

          // store the access token to the local authConfig object
          authConfig.ACCESS_TOKEN = access_token
          // convert the local authConfig object to a buffer to write to file
          fs.writeFileSync(configPath, Buffer.from(JSON.stringify(authConfig)))


          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };

          // use the access token, passed in the header of the request, to access the Spotify Web API
          // get request to the "me" endpoint returns user data
          request.get(options, function(error, response, body) {
            console.log('User info', body);
          });

          // we can also pass the token to the browser to make requests from there
          res.redirect('/#' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }));
        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      });
    }
  },

  refreshToken: (req, res) => {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }

      console.log('refreshToken', access_token);
    });
  },

  getArtist: (req, res, next) => {
    const promises = [];
    res.locals.forEach((djObj) => {
      Object.keys(djObj.tracksByArtist).forEach((producer) => {
        let promise = new Promise((resolve, reject) => {
        // fetch url for each artist in tracks object
        // within each artist fetch do a fetch for tracks
        const FETCH_URL = BASE_URL + 'q='+producer+'&type=artist&limit=1';

        const myOptions = {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + authConfig.ACCESS_TOKEN
          },
          mode: 'cors',
          cache: 'default'
        };

        fetch(FETCH_URL, myOptions)
          .then(response => response.json())
          .then(json => {
            if (json.artists && json.artists.items[0]) {
              const artist = json.artists.items[0];
              const artistID = artist.id; 
              return artistID;
            } else {
              // resolve with empty data if artist isn't found so all promises don't reject
              resolve({});
            }
          })
          .then(artistID => {
            // djObj[producer] is an array of track titles
            // filter the tracks fetched from Spotify by titles found in djObj
            return spotifyController.getTracks(myOptions, artistID, djObj[producer]);
          })
          .then(tracks => {
            resolve({ name: djObj.dj_name, tracks: tracks });
          })
          .then()
          .catch(error => {
            console.error(error)
          })
        })

        promises.push(promise);
      })
    })


    Promise.all(promises).then((artist) => {
      res.setHeader('Content-Type', 'application/json');
      console.log(artist);
      res.send(JSON.stringify(artist));
    })
    .catch((error) => {
      console.error(error);
    })
  },

  // create function for second get request, that returns a promise
  // invoke function in the promise of the first get request

  getTracks: (myOptions, artistID, trackTitles) => {
    const FETCH_URL = BASE_URL + 'artists/'+artistID+'/top-tracks?country=US';

    return new Promise ((resolve, reject) => {
      fetch(FETCH_URL, myOptions)
        .then(response => response.json())
        .then(json => {
          // const artist = json.artists.items[0];
          // const artistID == json.artists.items[0].id;

          // getTracks(FETCH_URL, myOptions, artistID);
          // // pass djObj.dj_name to resolve i.e. Promise.all
          console.log('getTracks', json);
          resolve(json)
        })
        .catch((error) => {
          console.error(error)
        })
    });
  }
}

module.exports = spotifyController;