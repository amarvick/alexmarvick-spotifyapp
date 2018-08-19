import Spotify from 'spotify-web-api-js';
import React, { Component } from 'react';
import axios from 'axios';

import ModalGreeting from './modalgreeting';
import QuestionTemplate from './questiontemplate';

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
      loggedInUser: {
        userId: ''
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
      noOfCorrect: 0,
      noOfMissed: 0,
      questions: []
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
  componentWillMount() {
    this.getUser()
    this.getFavoriteArtist()
  }

  getUser() {
    spotifyApi.getMe()
    .then((response) => {
      this.setState({
        loggedInUser: {
          userId: response.id
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

  // Alex, TO DO - probably a better way to map song uris to names. Look to see if there is a function that does this. Maybe put in an object? Find key/value pairs? I don't know, brainstorm...
  getFavoriteArtistsSongs(artistId, US) {
    spotifyApi.getArtistTopTracks(artistId, US)
      .then((response) => {
        var theSongUriToName = []
        var theSongUri = []
        var theSongName = []

        // Maps Song URI with Name so they are in the same order when generating playlist.
        for (var i = 0; i < 10; i++) {
          theSongUriToName.push(response.tracks[i].uri + '---' + response.tracks[i].name);
        }
        this.shuffle(theSongUriToName)

        for (var j = 0; j < 10; j++) {
          theSongUri.push(theSongUriToName[j].substr(0, theSongUriToName[j].indexOf('---')))
          theSongName.push(theSongUriToName[j].substr(theSongUriToName[j].indexOf('---') + 3, theSongUriToName[j].length - 1))
        }

        // AM - later, combine these setState functions

        this.setState({
          favoriteArtistsSongs: {
            songUris: theSongUri,
            songNames: theSongName
          }
        })

        var theQuestions = this.generateQuestions()

        this.setState({
          questions: theQuestions
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
    this.postPlaylist(this.state.loggedInUser.userId, this.state.favoriteArtistsSongs.songUris)

    document.getElementById('modal').style.display = 'none'
    document.getElementById('questionView1').style.display = 'inline-block'
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
        alert('ERROR CREATING PLAYLIST: ' + error)
        console.log(error)
      })
  }

  // Then... add tracks initially received to newly created playlist
  addTracksToPlaylist(newPlaylistId, allSongs, contextUri) {
    console.log(allSongs);
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
        this.playPlaylist(contextUri)
      })
      .catch((error) => {
        alert(error)
        console.log(error)
      })

  }

  // Then... play the playlist to get started
  playPlaylist(contextUri) {
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
        console.log(error)
      })
  }

  // Generates each question
  generateQuestions() {
    for (var i = 0; i < 10; i++) {
      var multChoiceOpts = []
      var noQuestionInserted = []
      var isQuestionInserted

      // Add correct answer
      multChoiceOpts.push(this.state.favoriteArtistsSongs.songNames[i]);
      noQuestionInserted.push(i); 

      // Add remaining three possible selections
      for (var j = 0; j < 3; j++) {
        isQuestionInserted = false;
        while(!isQuestionInserted) {
          var index = Math.floor(Math.random() * 9)
          
          if (!noQuestionInserted.includes(index)) {
            noQuestionInserted.push(index)
            multChoiceOpts.push(this.state.favoriteArtistsSongs.songNames[index])
            isQuestionInserted = true;
          } 
        }
      }
      this.shuffle(multChoiceOpts);
      this.state.questions.push(multChoiceOpts);
    }

    return this.state.questions;
  }















  renderQuestion(i) {
    return (
      <QuestionTemplate 
        questionAnswers = { this.state.questions[i] }
        correctResponse = { this.state.favoriteArtistsSongs.songNames[i] }
        questionNumber = { i + 1 }
      />
    )
  }













  render() {
    // AM todo - figure out a better way to organize this. For now, it is OK, but change later
    let questionView1, questionView2, questionView3, questionView4, questionView5, questionView6, questionView7, questionView8, questionView9, questionView10;

      // AM - Make these divs the classes, then the ones in questiontemplate.js the ids? (not high priority right now)
      if (this.state.questions != null && this.state.questions.length > 0) {
        questionView1 = ( <div id="questionView1"> { this.renderQuestion(0) } </div> );
        questionView2 = ( <div id="questionView2"> { this.renderQuestion(1) } </div> );
        questionView3 = ( <div id="questionView3"> { this.renderQuestion(2) } </div> );
        questionView4 = ( <div id="questionView4"> { this.renderQuestion(3) } </div> );
        questionView5 = ( <div id="questionView5"> { this.renderQuestion(4) } </div> );
        questionView6 = ( <div id="questionView6"> { this.renderQuestion(5) } </div> );
        questionView7 = ( <div id="questionView7"> { this.renderQuestion(6) } </div> );
        questionView8 = ( <div id="questionView8"> { this.renderQuestion(7) } </div> );
        questionView9 = ( <div id="questionView9"> { this.renderQuestion(8) } </div> );
        questionView10 = ( <div id="questionView10"> { this.renderQuestion(9) } </div> );
      }
    
    // console.log(questionView);
    return (
      <div className='Premium'>

        <div id="modal">
          <ModalGreeting
            username = { this.state.loggedInUser.userId }
          />
          <button onClick={() => this.startGame()}>
            PLAY NOW!
          </button>

          <br/>
        </div>

        {/* AM todo - figure out a better way to organize this. For now, it is OK, but change later */}
        { questionView1 }
        { questionView2 }
        { questionView3 }
        { questionView4 }
        { questionView5 }
        { questionView6 }
        { questionView7 }
        { questionView8 }
        { questionView9 }
        { questionView10 }
        
      </div>
    )
  }
}
export default Premium;