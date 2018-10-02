/* File Name: App.js                                                *
 * Description: The page that displays everything on the front end. *
 *              What renders depends on the state of the user       *
 *              (if user is logged in, premium...)                  */

import Spotify from 'spotify-web-api-js';
import React, { Component, StartupActions } from 'react';
import { connect } from 'react-redux';

import NonPremium from './js/components/nonPremium';
import Premium from './js/components/premium';
import Login from './js/components/login';
import Loading from './js/components/loading'

import './stylesheets/App.scss';

import { fetchUser } from './js/actions/userActions'

const spotifyApi = new Spotify();

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
    let user = this.props.user || {}
    let loading = this.props.loading || null

    // loggedInScreen determines what view the user will see if the user is logged in, based off of whether that user is a premium user.
    let loggedInScreen

    if (user.product === 'premium') {
      loggedInScreen = (
        <Premium 
          username = { user.id }
          accesstoken = { this.getHashParams().access_token }
        />
      )
    } else {
      loggedInScreen = (
        <NonPremium 
          username = { user.id }
        />
      )
    }

    if (loading) {
      return (
        <Loading/>
      )
    } else {
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
}

// wraps dispatch to create nicer functions to call within our component
// Mapping dispatch actions to the props
const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
  startup: () => dispatch(StartupActions.startup())
})

// Maps the state in to props (for displaying on the front end)
const mapStateToProps = (state) => ({
  user: state.user.user,
  loading: state.inGameData.loading
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
