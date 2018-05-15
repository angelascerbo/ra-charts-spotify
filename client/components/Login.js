import React, { Component } from 'react'


// refactor to functional component
class Login extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div id="login">
        <a href="/login">Log in with Spotify</a>
      </div>
		)
	}
}

export default Login