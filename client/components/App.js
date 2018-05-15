import React, { Component } from 'react'


// refactor to functional component 
class App extends Component {
	render() {
		const { children } = this.props;
		return (
			<div>
				<h1>RA x Spotify</h1>
				{ children }
			</div>
		)
	}
}

export default App