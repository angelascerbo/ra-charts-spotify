import * as types from './../constants';
import Spotify from 'spotify-web-api-js';
const spotifyApi = new Spotify();

const setTokens = ({accessToken, refreshToken}) => {
	if (accessToken) {
		spotifyApi.setAccessToken(accessToken);
	}

	return {
		type: types.SPOTIFY_TOKENS,
		accessToken,
		refreshToken
	}
}

const getMyInfo = () => {
	return (dispatch) => {
		dispatch({ type: types.SPOTIFY_ME_BEGIN });
		spotifyApi.getMe().then(data => {
			dispatch({ type: types.SPOTIFY_ME_SUCCESS, data: data });
		}).catch(e => {
			dispatch({ type: SPOTIFY_ME_FAILURE, error: e });
		});
	};
}

module.exports = {
	setTokens,
	getMyInfo
}