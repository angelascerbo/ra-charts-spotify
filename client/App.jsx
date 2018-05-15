import React, { Component } from 'react'
import Login from './Login.jsx'
import {
	BrowserRouter as Router, 
	Route, 
	Link, 
	Redirect,
	withRouter,
	Switch
} from 'react-router-dom'

const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>

// Login component displays at root
// Button handles Spotify Authentication


// Signout button, child of protected component
const AuthButton = withRouter(({history}) => (
	fakeAuth.isAuthenticated 
		? <p>Welcome <button onClick={() => {
			fakeAuth.signout(() => history.push('/'))
		}}>Sign out</button></p>
		: <p>Not logged in</p>
))

const PrivateRoute = ({ component: Component, authed,...rest }) => (
	<Route 
		{...rest} 
		render={(props) => authed 
			? <Component {...props} />
			: <Redirect to="/" />
		}
	/>
)
 
class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			isAuthenticated: false
		}

		this.login = this.login.bind(this);
	}
	componentDidMount(){
	}

	login() {
		console.log('login')
		this.setState({
			isAuthenticated: true
		})
	}
	
	render() {
		console.log(this.state.isAuthenticated)
		return (
			<Router>
				<div>
					{/*<AuthButton/>*/}
					<Switch>
						<Route 
							path="/login" 
							render={props => <Login {...props} isAuth={this.state.isAuthenticated} initLogin={this.login} />} 
						/>
						<Route
							exact path="/"
							render={props => this.state.isAuthenticated
								? <Protected/>
								: <Redirect to="/login"/>
							}
						/>
					</Switch>
				</div>
			</Router>
		)
	}
}

export default App