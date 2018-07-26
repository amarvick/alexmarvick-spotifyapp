import Spotify from 'spotify-web-api-js';
import React, { Component } from 'react';
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
      loggedIn: token ? true : false,
      nowPlaying: { 
        name: 'Not Checked', 
        artist: '',
        type: '',
        albumArt: '' 
      },
      favoriteArtists: {
        artist: '',
        artistId: ''
      },
      favoriteArtistsSongs: {
        songs: []
      }
    }
    console.log(params);
  }
 
  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            artist: response.item.artists[0].name,
            type: response.item.type,
            albumArt: response.item.album.images[0].url
          }
        })
      })
  }

  getFavoriteArtists() {
    spotifyApi.getMyTopArtists()
      .then((response) => {
        this.setState({
          favoriteArtists: {
            artist: response.items[0].name,
            artistId: response.items[0].id
          }
        })
        alert(this.state.favoriteArtists.artist)
      })
  }

  // getFavoriteArtistsSongs() {
  //   spotifyAPi.get
  // }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  render() {
    return (
      <div className='App'>
        <a href='http://localhost:8888'> Login to Spotify </a>
        <div>
          { this.state.nowPlaying.artist } - { this.state.nowPlaying.name } <br/>
          Key: { this.state.nowPlaying.type }
        </div>
        <div>
          <img src={ this.state.nowPlaying.albumArt } style={{ height: 150 }}/>
        </div>

        <div>
          Favorite Artist: { this.state.favoriteArtists.artist }
        </div>

        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        }

        { this.state.loggedIn &&
          <button onClick={() => this.getFavoriteArtists()}>
            Check Favorite Artists
          </button>
        }
      </div>
    )
  }
}
export default App;