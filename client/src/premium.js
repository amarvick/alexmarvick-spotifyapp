import Spotify from 'spotify-web-api-js';
import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const spotifyApi = new Spotify();

class Premium extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;

    if (token) {
      spotifyApi.setAccessToken(token);
    }

    this.state = { 
      accesstoken: token,
      loggedIn: true,
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
    this.getFavoriteArtist()
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
        this.getFavoriteArtistsSongs(this.state.favoriteArtists.artistId, 'US')
      })
  }

  // Alex, TO DO - probably a better way to map song uris to names. Look to see if there is a function that does this.
  getFavoriteArtistsSongs(artistId, US) {
    spotifyApi.getArtistTopTracks(artistId, US)
      .then((response) => {
        var theSongUriToName = []
        var theSongUri = []
        var theSongName = []
        for (var i = 0; i < 10; i++) {
          theSongUri.push(response.tracks[i].uri); // + '---' + response.tracks[i].name);
          // theSongNames.push(response.tracks[i].name);
        }
        this.shuffle(theSongUri)
        this.setState({
          favoriteArtistsSongs: {
            songUri: theSongUri,
            songNames: theSongName
          }
        })
      })
  }

  // Randomize the generated playlist order
  shuffle(tracksArray) {
    var currentIndex = tracksArray.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = tracksArray[currentIndex];
      tracksArray[currentIndex] = tracksArray[randomIndex];
      tracksArray[randomIndex] = temporaryValue;
    }
  
    return tracksArray;
  }


  // STARTING THE GAME:
  startGame() {
    document.getElementById('modal').style.display = 'none'
    this.postPlaylist(this.state.loggedInUser.userId, this.state.favoriteArtistsSongs.songUris)
  }

  // Will create private playlist on user's spotify account
  postPlaylist(userId, allSongs) {
    axios({
      url: 'https://api.spotify.com/v1/users/' + this.state.loggedInUser.userId + '/playlists',
      method: "POST",
      data: {
        name: 'HOW BIG OF A ' + this.state.favoriteArtists.artist.toUpperCase() + ' FAN ARE YOU?',
        public: true
      },
      headers: {
        'Authorization': 'Bearer ' + this.state.accesstoken,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        var playlistId = response.data.id;
        var uri = response.data.uri
        this.addTracksToPlaylist(playlistId, allSongs, uri);
      })
      .catch((error) => {
        alert('ERROR! ' + error)
        console.log(error)
      })
  }

  // Then... add tracks initially received to newly created playlist
  addTracksToPlaylist(newPlaylistId, allSongs, contextUri) {
    axios({
      url: 'https://api.spotify.com/v1/users/' + this.state.loggedInUser.userId + '/playlists/' + newPlaylistId + '/tracks/',
      method: "POST",
      data: {
        uris: allSongs
      },
      headers: {
        'Authorization': 'Bearer ' + this.state.accesstoken,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        console.log(response);
        this.playPlaylist(newPlaylistId, contextUri)
      })
      .catch((error) => {
        alert(error)
        console.log(error)
      })

  }

  // Then... play the playlist to get started
  playPlaylist(newPlaylistId, contextUri) {
    axios({
      url: 'https://api.spotify.com/v1/me/player/play',
      method: "PUT",
      data: {
        context_uri: contextUri
      },
      headers: {
        'Authorization': 'Bearer ' + this.state.accesstoken
      }
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        alert(error)
        console.log(error)
      })
    // this.generateQuestion()
  }

  generateQuestion() {
    var options = [];
  }

  render() {
    return (
      <div className='App'>
        { !this.state.loggedIn &&
          <a href='http://localhost:8888'>Login to Spotify</a>
        }

        { this.state.loggedIn &&
          <div>
            Favorite Artist: { this.state.favoriteArtists.artist }
          </div>
        }

        { this.state.loggedIn && this.state.loggedInUser.userProduct === 'premium' &&
          <div id="modal">
            <h1>Welcome to Marvify!</h1>
            <p>Hello, Spotify User! Thank you for taking the time to play my game. This is a 10 question quiz to see how well you know your favorite artist's top songs!</p>
            <p>As soon as you click 'play', your spotify account will immediately create a playlist of your top artist's favorite songs. You will be prompted 10 questions, one by one, 
              giving you ten seconds to determine the song. If you guess incorrectly or run out of time, the question will
              be flagged as incorrect. Otherwise, it will be correct.
            </p>

            <p>
              PLEASE NOTE: You must take this quiz in one sitting! If you attempt to click away from the screen or open up your playlist, you will automatically score a 0/10.
              Additionally, if you attempt to pause the song in the middle of any question, that question will be marked as wrong.
            </p>
            <p>Once you are finished, you will receive your results. Good luck!</p>

            <button onClick={() => this.startGame()}>
              PLAY NOW!
            </button>
          </div>
        }

      </div>
    )
  }
}
export default Premium;