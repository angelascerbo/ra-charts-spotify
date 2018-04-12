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
		// console.log(this.props.isAuth)
		//  /**
	 //   * Obtains parameters from the hash of the URL
	 //   * @return Object
	 //   */
	 //  function getHashParams() {
	 //    var hashParams = {};
	 //    var e, r = /([^&;=]+)=?([^&;]*)/g,
	 //        q = window.location.hash.substring(1);
	 //    while ( e = r.exec(q)) {
	 //       hashParams[e[1]] = decodeURIComponent(e[2]);
	 //    }
	 //    return hashParams;
	 //  }

	 //  var params = getHashParams();

	 //  var access_token = params.access_token,
	 //      refresh_token = params.refresh_token,
	 //      error = params.error;

	 //  if (error) {
	 //    alert('There was an error during the authentication');
	 //  } else {
	 //    if (access_token) {
	 //      const callback = this.login;

	 //      $.ajax({
	 //          url: 'https://api.spotify.com/v1/me',
	 //          headers: {
	 //            'Authorization': 'Bearer ' + access_token
	 //          },
	 //          success: function(response) {
	 //          	// this.login() -->> NOT A FUNCTION: context of "this" changes inside success cb
	 //            callback();
	 //          }
	 //      });
	 //    }
	 //  }
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