import Spotify from 'spotify-web-api-js';
import React, { Component, StartupActions } from 'react';
import axios from 'axios'; // AM - will get rid of eventually
import { connect } from 'react-redux';

import ModalGreeting from './modalgreeting';
import QuestionTemplate from './questiontemplate';
import ResultsTemplate from './resultstemplate';

import { fetchArtist } from '../actions/artistActions'
import { fetchSongs } from '../actions/songsActions'

const spotifyApi = new Spotify(); // AM - will get rid of eventually

connect((store) => {
  return {
    artist: store.artist.artist,
    songs: store.songs.songs,
  };
})

class Premium extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      accesstoken: '',
      loggedInUserId: '',
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
      questions: [],
      questionNo: 0,
      gameInProgress: false,
      resultsReady: false,
      didUserCheat: false
    }
    
    // Functions needed to update the state when passing props in to question template
    this.onAnswerSelect = this.onAnswerSelect.bind(this);
  }

  // Get logged in user + favorite artist.. Maybe combine the three functions used together?
  componentWillMount() {
    // this.getFavoriteArtist()
    this.props.dispatch(fetchArtist()); 
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    this.props.dispatch(fetchArtist()); 
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

        // AM - later, combine these setState functions? Might not be doable. Also figure out why I'm setting questions state here instead of in function?
        this.setState({
          favoriteArtistsSongs: {
            songUris: theSongUri,
            songNames: theSongName
          }
        })

        this.setState({ questions: this.generateQuestions() })
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
    // AM To do - May need to find better way of organizing everything that goes on? Because this posts the playlist, 
    // then does a multitude of other things... 'post playlist' may not be the best function name therefore? Not sure - brainstorm
    this.postPlaylist(this.props.loggedInUserId, this.state.favoriteArtistsSongs.songUris)
    this.removeShuffle()
    this.setState({ gameInProgress: true });
  }

  // Will create private playlist on user's spotify account
  postPlaylist(userId, allSongs) {
    axios({
      url: 'https://api.spotify.com/v1/users/' + userId + '/playlists',
      method: "POST",
      data: {
        name: 'HOW BIG OF A ' + this.state.favoriteArtists.artist.toUpperCase() + ' FAN ARE YOU?',
        public: true
      },
      headers: {
        'Authorization': 'Bearer ' + this.props.accesstoken,
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
    axios({
      url: 'https://api.spotify.com/v1/users/' + this.props.loggedInUserId + '/playlists/' + newPlaylistId + '/tracks/',
      method: "POST",
      data: {
        uris: allSongs
      },
      headers: {
        'Authorization': 'Bearer ' + this.props.accesstoken,
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

  // If shuffle is set, can ruin the experience.
  removeShuffle() {
    axios({
      url: 'https://api.spotify.com/v1/me/player/shuffle?state=false',
      method: "PUT",
      headers: {
        'Authorization': 'Bearer ' + this.props.accesstoken
      }
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
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
        'Authorization': 'Bearer ' + this.props.accesstoken
      }
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // Plays next track in playlist
  playNextTrack() {
    axios({
      url: 'https://api.spotify.com/v1/me/player/next',
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + this.props.accesstoken
      }
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // Stops playlist at the end of the game
  stopPlaylist() {
    axios({
      url: 'https://api.spotify.com/v1/me/player/pause',
      method: "PUT",
      headers: {
        'Authorization': 'Bearer ' + this.props.accesstoken
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

  // Maybe not make this a function, but put in the render.
  // renderQuestion(i) {
  //   return (
  //     <QuestionTemplate 
  //       questionAnswers = { this.state.questions[i] }
  //       correctResponse = { this.state.favoriteArtistsSongs.songNames[i] }
  //       questionNumber = { i + 1 }
  //       onAnswerSelect = {this.onAnswerSelect}
  //     />
  //   )
  // }

  // Determines if answer was correct or not, and whether to proceed to next question or be done.
  onAnswerSelect(isCorrect) {
    if (isCorrect) {
      alert('CORRECT!');
      this.setState({ noOfCorrect: this.state.noOfCorrect + 1 })
    } else {
      alert('INCORRECT ANSWER :(');
    }

    // Changes to the next question OR you're finished and the results will be presented.
    if (this.state.questionNo < 9) {
      this.setState({ questionNo: this.state.questionNo + 1 })
      this.playNextTrack()
    } else {
      this.setState({ resultsReady: true })
      this.stopPlaylist();
    }
  }

  render(props) {
    let theGameView;
    let artist = {};

    if (this.props.artist) {
      artist = this.props.artist;
    }

    // AM todo - see if you can combine theGameView results together
    if (this.state.questions != null && this.state.questions.length > 0) {
      if (!this.state.resultsReady || !this.state.didUserCheat) {
        theGameView = ( 
          // <div id="theGameView"> 
          //   { this.renderQuestion(this.state.questionNo) } 
          // </div> 
          <QuestionTemplate 
            questionAnswers = { this.state.questions[this.state.questionNo] }
            correctResponse = { this.state.favoriteArtistsSongs.songNames[this.state.questionNo] }
            questionNumber = { this.state.questionNo + 1 }
            onAnswerSelect = {this.onAnswerSelect}
          />
        )
      } else {
        theGameView = ( 
          <ResultsTemplate
            correctCount = { this.state.noOfCorrect }
            didUserCheat = { this.state.didUserCheat }
          />
        )
      }
    } 
    
    return (
      <div className='Premium'>
        { !this.state.gameInProgress && !this.state.resultsReady ? (
          <div>
            <ModalGreeting
              username = { this.props.loggedInUserId }
            />

            <button type="button" className="btn btn-primary" onClick={() => this.startGame()}>
              PLAY NOW!
            </button>

            <br/>
          </div> ) : theGameView 
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
  user: state.user.user,
  artist: state.artist.artist,
  songs: state.songs.songs
})

export default connect(mapStateToProps, mapDispatchToProps)(Premium);