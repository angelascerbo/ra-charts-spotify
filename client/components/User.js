import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './../actions';

const mapStateToProps = store => ({
	accessToken: store.accessToken,
	refreshToken: store.refreshToken,
	user: store.user
})

const mapDispatchToProps = dispatch => ({
	setTokens: ({accessToken, refreshToken}) => dispatch(actions.setTokens({accessToken, refreshToken})),
	getMyInfo: () => dispatch(actions.getMyInfo())
})

class User extends Component {
	componentDidMount() {
		const { accessToken, refreshToken } = this.props.params;
		this.props.setTokens();
		this.props.getMyInfo();
	}

	render() {
		const { accessToken, refreshToken, user } = this.props;
		const { loading, display_name, images, id, email, external_urls, href, country, product } = user;

		if (loading) {
			return <h2>Loading...</h2>
		}

		return (
			<h2>{`Logged in as ${display_name}`}</h2>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(User);