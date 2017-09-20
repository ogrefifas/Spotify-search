import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { localStorageService } from '../services';
import { Link } from 'react-router-dom';

class Logout extends Component {

	constructor(props) {
		super(props);
		this.logout = this.logout.bind(this);
	}

	logout() {
		localStorageService.removeItem('accessToken');
		this.props.setAuthorization(false);
	}

    render() {
        return (
            <Link to="/login" className="nav-button logout" onClick={this.logout}>
            	<i className="fa fa-sign-out" aria-hidden="true"></i>
				<div>Sign Out</div>
            </Link>
        );
    }
}

Logout.propTypes = {
    setAuthorization: PropTypes.func
};

export default Logout;