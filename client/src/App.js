import Spotify from 'spotify-web-api-js';
import React, { Component } from 'react';
import axios from 'axios';

import NonPremium from './nonPremium';
import Premium from './premium';
import Login from './login';

import './App.css';

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
      accesstoken: token,
      loggedIn: token ? true : false,
      loggedInUser: {
        userId: '',
        userProduct: ''
      },
      favoriteArtists: {
        artist: '',
        artistId: ''
      },
      favoriteArtistsSongs: {
        songUriToName: [],
        songUris: [],
        songNames: []
      },
      questionNumber: 1
    }
    console.log(params);
  }
 
  // Retrieving the access token needed for POST requests
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  // Get logged in user + favorite artist.. Maybe combine the three functions used together?
  componentDidMount() {
    this.getUser()
  }

  checkState() {
    console.log(this.state)
  }

  getUser() {
    spotifyApi.getMe()
    .then((response) => {
      this.setState({
        loggedInUser: {
          userId: response.id,
          userProduct: response.product
        }
      })
    })
  }

  render() {
    return (
      <div className='App'>
        { !this.state.loggedIn &&
          <Login/>
        }

        { this.state.loggedIn && this.state.loggedInUser.userProduct !== 'premium' && this.state.loggedInUser.userProduct !== '' &&
          <NonPremium />
        }

        { this.state.loggedIn && this.state.loggedInUser.userProduct === 'premium' &&
          <Premium />
        }

      </div>
    )
  }
}
export default App;