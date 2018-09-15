import Spotify from 'spotify-web-api-js';
import React, { Component, StartupActions } from 'react';
import { connect } from 'react-redux';

import ModalGreeting from './modalgreeting';
import QuestionTemplate from './questiontemplate';
import ResultsTemplate from './resultstemplate';

import { fetchArtist } from '../actions/artistActions'
import { fetchSongs } from '../actions/songsActions'
import { postPlaylist } from '../actions/songsActions'
import { removeShuffle } from '../actions/songsActions'
import { stopPlaylist } from '../actions/songsActions'
import { playNextTrack } from '../actions/songsActions'
import { generateQuestions } from '../actions/songsActions'

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
      favoriteArtistsSongs: {
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

  // Retrieve artists and songs
  componentDidMount() {
    // AM - can probably combine fetchArtist with fetchSongs. Change action name to 'artistSongsActions' or something
    this.props.dispatch(fetchArtist());
  }

  // Alex, TO DO - probably a better way to map song uris to names. Look to see if there is a function that does this. Maybe put in an object? Find key/value pairs? I don't know, brainstorm...
  getFavoriteArtistsSongs(songs) {
    var theSongUriToName = []
    var theSongUris = []
    var theSongNames = []

    // Maps Song URI with Name so they are in the same order when generating playlist.
    for (var i = 0; i < songs.length; i++) {
      theSongUriToName.push(songs[i].uri + '---' + songs[i].name);
    }

    this.shuffle(theSongUriToName)
    
    for (var j = 0; j < theSongUriToName.length; j++) {
      theSongUris.push(theSongUriToName[j].substr(0, theSongUriToName[j].indexOf('---')))
      theSongNames.push(theSongUriToName[j].substr(theSongUriToName[j].indexOf('---') + 3, theSongUriToName[j].length - 1))
    }

    // AM - later, combine these setState functions? Might not be doable. Also figure out why I'm setting questions state here instead of in function?
    this.setState({
      favoriteArtistsSongs: {
        songUris: theSongUris,
        songNames: theSongNames
      }}, function () {
        this.setState({ questions: generateQuestions(this.state.favoriteArtistsSongs.songNames, this.state.questions) }, function () {
          this.startGame()
        })
      }
    )
  }

  // STARTING THE GAME:
  startGame() {
    removeShuffle(this.props.accesstoken)
    this.setState({ gameInProgress: true }, function() { 
      postPlaylist(this.props.loggedInUserId, this.state.favoriteArtistsSongs.songUris, this.props.artist.name, this.props.accesstoken) 
    });
  }

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
      playNextTrack(this.props.accesstoken)
    } else {
      this.setState({ resultsReady: true }, function() { 
        stopPlaylist(this.props.accesstoken)
      })
    }
  }

  render(props) {
    let theGameView;
    let artist = {};

    if (this.props.artist) {
      artist = this.props.artist;
    }

    let songs = []

    if (this.props.songs) {
      songs = this.props.songs;
    }

    // AM todo - see if you can combine theGameView results together
    if (this.state.questions != null && this.state.questions.length > 0) {
      if (!this.state.resultsReady && !this.state.didUserCheat) {
        theGameView = ( 
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

            <button type="button" className="btn btn-primary" onClick={() => this.getFavoriteArtistsSongs(songs)}>
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