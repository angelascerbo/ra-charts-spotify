import React, { Component } from 'react'
import {
	Route, 
	Redirect
} from 'react-router-dom'

import App from './App.jsx'
import fetch from 'isomorphic-fetch'

class Login extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div id="login">
        <h1>RA x Spotify</h1>
        <a href="/login">Log in with Spotify</a>
      </div>
		)
	}
}

export default Login