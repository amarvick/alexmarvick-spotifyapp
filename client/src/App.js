import Spotify from 'spotify-web-api-js';
import React, { Component } from 'react';
import axios from 'axios';
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
        userId: ''
      },
      nowPlaying: { 
        name: '', 
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

  // Get logged in user
  componentDidMount() {
    spotifyApi.getMe()
      .then((response) => {
        this.setState({
          loggedInUser: {
            userId: response.id
          }
        })
      })
    this.getFavoriteArtist()
  }

  // getNowPlaying() {
  //   spotifyApi.getMyCurrentPlaybackState()
  //     .then((response) => {
  //       this.setState({
  //         nowPlaying: {
  //           name: response.item.name,
  //           artist: response.item.artists[0].name,
  //           type: response.item.type,
  //           albumArt: response.item.album.images[0].url
  //         }
  //       })
  //     })
  // }

  // Get user's favorite artist
  getFavoriteArtist() {
    spotifyApi.getMyTopArtists()
      .then((response) => {
        this.setState({
          favoriteArtists: {
            artist: response.items[0].name,
            artistId: response.items[0].id
          }
        })
        this.getFavoriteArtistsSongs(this.state.favoriteArtists.artistId, 'SE')
      })
  }

  // Alex, TO DO - Make it get all songs without having to predict a loop of 10 items
  getFavoriteArtistsSongs(artistId, US) {
    spotifyApi.getArtistTopTracks(artistId, US)
      .then((response) => {
        var theSongs = []
        for (var i = 0; i < 10; i++) {
          theSongs.push((i+1) + '. ' +response.tracks[i].name);
        }
        this.setState({
          favoriteArtistsSongs: {
            songs: theSongs
          }
        })
        // this.postPlaylist(this.state.loggedInUser.userId, theSongs)
      })
  }

  // Will create private playlist on user's spotify account
  postPlaylist(userId, allSongs) {
    axios({
      url: 'https://api.spotify.com/v1/users/' + this.state.loggedInUser.userId + '/playlists',
      method: "POST",
      data: {
        name: 'Game Playlist',
        public: false
      },
      headers: {
        'Authorization': 'Bearer ' + this.state.accesstoken,
        'Content-Type': 'application/json'
      },
      success: function(response) {
        console.log(response);
      }  
    })
      .then((response) => {
        var playlistId = response.data.id;
        this.addTracksToPlaylist(response.data.id, allSongs);
      })
      .catch((error) => {
        alert('ERROR! ' + error)
      })
  }

  addTracksToPlaylist(newPlaylistId, allSongs) {
    alert(newPlaylistId);
    alert(allSongs);
  }

  render() {
    let songs = [];

    if (this.state.favoriteArtistsSongs.songs) {
      songs = this.state.favoriteArtistsSongs.songs;
    }

    const orderedSongs = songs.map(song =>
      <li>
        {song}
      </li>
    )

    return (
      <div className='App'>
        { !this.state.loggedIn &&
          <a href='http://localhost:8888'> Login to Spotify </a>
        }

        { this.state.loggedIn && this.state.nowPlaying.name !== '' && this.state.nowPlaying.name !== null &&
          <div>
            { this.state.nowPlaying.artist } - { this.state.nowPlaying.name } <br/>
            {/* Key: { this.state.nowPlaying.type } */}
          </div>
        }

        { this.state.loggedIn &&
          <div>
            <img src={ this.state.nowPlaying.albumArt } style={{ height: 150 }}/>
          </div>
        }

        { this.state.loggedIn &&
          <div>
            Favorite Artist: { this.state.favoriteArtists.artist }
          </div>
        }

        { this.state.loggedIn &&
          <div>
            Top Songs: <br/>
            <ul>{orderedSongs}</ul>
          </div>
        }

        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        }

        { this.state.loggedIn && 
          <button onClick={() => this.postPlaylist(this.state.loggedInUser.userId, this.state.favoriteArtistsSongs.songs)}>
            Post Playlist
          </button>
        }
      </div>
    )
  }
}
export default App;