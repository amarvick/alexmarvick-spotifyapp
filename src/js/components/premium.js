/* File Name: premium.js                                            *
 * Description: The game display. For premium users only            */

import React, { Component, StartupActions } from 'react';
import { connect } from 'react-redux';

import ModalGreeting from './modalgreeting';
import QuestionTemplate from './questiontemplate';
import ResultsTemplate from './resultstemplate';

import { fetchArtist } from '../actions/artistActions'
import { stopPlaylist } from '../actions/inGameActions'
import { playNextTrack } from '../actions/inGameActions'
import { organizeSongUriAndNames } from '../actions/inGameActions'
import { onAnswerSelect } from '../actions/inGameActions'

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
      loggedInUserId: ''
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
    this.props.dispatch(onAnswerSelect(isCorrect, this.props.inGameData.questionNo, this.props.inGameData.noOfCorrect, this.props.accesstoken));
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
    if (inGameData.questions.questions != null && inGameData.questions.questions.length > 0) {
      if (!inGameData.resultsReady && !inGameData.didUserCheat) {
        theGameView = ( 
          <QuestionTemplate 
            questionAnswers = { inGameData.questions.questions[inGameData.questionNo] }
            correctResponse = { inGameData.favoriteArtistsSongs.favoriteArtistsSongs.songNames[inGameData.questionNo] }
            questionNumber = { inGameData.questionNo + 1 }
            onAnswerSelect = {this.onAnswerSelect}
          />
        )
      } else {
        theGameView = ( 
          <ResultsTemplate
            correctCount = { inGameData.noOfCorrect }
            didUserCheat = { inGameData.didUserCheat }
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
