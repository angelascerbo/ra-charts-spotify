import React from 'react';
import { render } from 'react-dom';
// import Login from './Login.jsx';
import App from './App.jsx';

// import {
// 	BrowserRouter as Router,
// 	Route
// } from 'react-router-dom'
//	<Router>
//		<div>
//		<Route path="/" component={Login} />
//	</div>
// </Router>,
render(
	<App/>,
  document.getElementById('root')
);
