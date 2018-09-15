import Spotify from 'spotify-web-api-js'; // AM - to remove later
import React, { Component, StartupActions } from 'react';
import { connect } from 'react-redux';

import NonPremium from './js/components/nonPremium';
import Premium from './js/components/premium';
import Login from './js/components/login';

import './stylesheets/App.scss';

import { fetchUser } from './js/actions/userActions'

const spotifyApi = new Spotify(); // AM - to remove later

connect((store) => {
  return {
    user: store.user.user,
  };
})

class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;

    if (token) {
      spotifyApi.setAccessToken(token);
    }

    this.state = { 
      loggedIn: token ? true : false
    }
  }

  // Retrieving the access token needed to get user credentials
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  componentWillMount() {
    this.props.dispatch(fetchUser()); 
  }

  render() {
    let user = {}

    if (this.props.user) {
      user = this.props.user;
    }

    let loggedInScreen

    if (user.product !== 'premium' && user.product !== '') {
      loggedInScreen = (
        <NonPremium 
          loggedInUserId = { user.id }
        />
      )
    } else {
      loggedInScreen = (
        <Premium 
          loggedInUserId = { user.id }
          accesstoken = { this.getHashParams().access_token }
        />
      )
    }


    return (
      <div className='App'>
        { !this.state.loggedIn ? (
            <Login/>
          ) : loggedInScreen 
        }
      </div>
    )
    
    
  }
}

// wraps dispatch to create nicer functions to call within our component
// Mapping dispatch actions to the props
const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
  startup: () => dispatch(StartupActions.startup())
})

// Maps the state in to props (for displaying on the front end)
const mapStateToProps = (state) => ({
  nav: state.nav,
  user: state.user.user
})

export default connect(mapStateToProps, mapDispatchToProps)(App);