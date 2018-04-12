import React, { Component } from 'react'
import {
	// BrowserRouter as Router, 
	Route, 
	// Link, 
	// withRouter,
	Redirect
} from 'react-router-dom'

import App from './App.jsx'
import fetch from 'isomorphic-fetch'

class Login extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		{/*const { redirectToReferrer } = this.state;

		if (redirectToReferrer) {
			return (
				<Route path="/" component={App} />
			)
		}*/}
		return (
			<div id="login">
        <h1>RA x Spotify</h1>
        <a href="/login">Log in with Spotify</a>
      </div>
		)
	}
}

export default Login