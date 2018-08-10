import Spotify from 'spotify-web-api-js';
import React, { Component } from 'react';

import NonPremium from './components/nonPremium';
import Premium from './components/premium';
import Login from './components/login';

import './stylesheets/App.css';

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
      loggedIn: token ? true : false,
      loggedInUser: {
        userProduct: ''
      }
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

  componentDidMount() {
    this.getUserProduct()
  }

  checkState() {
    console.log(this.state)
  }

  getUserProduct() {
    spotifyApi.getMe()
    .then((response) => {
      this.setState({
        loggedInUser: {
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