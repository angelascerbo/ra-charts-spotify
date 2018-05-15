import * as types from './../constants'

const initialState = {
  accessToken: null,
  refreshToken: null,
  user: {
    loading: false,
    country: null,
    display_name: null,
    email: null,
    external_urls: {},
    followers: {},
    href: null,
    id: null,
    images: [],
    product: null,
    type: null,
    uri: null,
  }
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
  case types.SPOTIFY_TOKENS: 
    const { accessToken, refreshToken } = action;
    return Object.assign({}, state, {accessToken, refreshToken});

  case types.SPOTIFY_ME_BEGIN:
    return Object.assign({}, state, {
      user: Object.assign({}, state.user, {loading: true})
    });

  case types.SPOTIFY_ME_SUCCESS: 
    return Object.assign({}, state, {
      user: Object.assign({}, state.user, action.data, {loading: false})
    })

  case types.SPOTIFY_ME_FAILURE: 
    // handle unsuccessful auth here
    return state
    
  default:
    return state
  }
}

export default mainReducer;
