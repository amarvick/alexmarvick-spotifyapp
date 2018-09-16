import React, { Component, StartupActions } from 'react';
import { connect } from 'react-redux';

import ModalGreeting from './modalgreeting';
import QuestionTemplate from './questiontemplate';
import ResultsTemplate from './resultstemplate';

import { fetchArtist } from '../actions/artistActions'
import { stopPlaylist } from '../actions/inGameActions'
import { playNextTrack } from '../actions/inGameActions'
import { organizeSongUriAndNames } from '../actions/inGameActions'

connect((store) => {
  return {
    artist: store.artist.artist,
    songs: store.songs.songs,
    inGameData: store.inGameData.inGameData
  };
})

class Premium extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      accesstoken: '',
      loggedInUserId: '',
      noOfCorrect: 0,
      questionNo: 0
    }
    
    // Functions needed to update the state when passing props in to question template
    this.onAnswerSelect = this.onAnswerSelect.bind(this);
  }

  // Retrieve artists and songs
  componentDidMount() {
    // AM - can probably combine fetchArtist with fetchSongs. Change action name to 'artistSongsActions' or something
    this.props.dispatch(fetchArtist());
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

    let artist = {}

    if (this.props.artist) {
      artist = this.props.artist;
    }

    let songs = []

    if (this.props.songs) {
      songs = this.props.songs;
    }

    let inGameData = {};

    if (this.props.inGameData) {
      inGameData = this.props.inGameData
    }

    // AM todo - see if you can combine theGameView results together
    if (this.state.questions != null && this.state.questions.length > 0) {
      if (!inGameData.resultsReady && !inGameData.didUserCheat) {
        theGameView = ( 
          <QuestionTemplate 
            questionAnswers = { this.props.questions[this.state.questionNo] }
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
        { !inGameData.gameInProgress && !inGameData.resultsReady ? (
          <div>
            <ModalGreeting
              username = { this.props.loggedInUserId }
            />

            <button type="button" className="btn btn-primary" onClick={() => this.props.dispatch(organizeSongUriAndNames(songs, this.props.accesstoken, this.props.loggedInUserId, artist.name))}>
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
  songs: state.songs.songs,
  inGameData: state.inGameData.inGameData
})

export default connect(mapStateToProps, mapDispatchToProps)(Premium);