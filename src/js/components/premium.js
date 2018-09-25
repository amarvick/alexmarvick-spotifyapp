/* File Name: premium.js                                            *
 * Description: The game display. For premium users only            */

import React, { Component, StartupActions } from 'react'
import { ButtonToolbar, Button, Modal } from 'react-bootstrap'
import { connect } from 'react-redux'

import ModalGreeting from './modalgreeting'
import QuestionTemplate from './questiontemplate'
import ResultsTemplate from './resultstemplate'
import GameDifficulty from './gameDifficulty'

import { organizeSongUriAndNames } from '../actions/inGameActions'
import { onAnswerSelect } from '../actions/inGameActions'

connect((store) => {
  return {
    artist: store.artist.artist,
    songs: store.songs.songs,
    inGameData: store.inGameData.inGameData,
    loading: store.inGameData.loading,
    userError: store.user.error,
    artistError: store.artist.error,
    songsError: store.songs.error,
    inGameDataError: store.inGameData.error
  }
})

class Premium extends Component {
  constructor(props) {
    super(props)

    this.state = { 
      accesstoken: '',
      loggedInUserId: ''
    }
    
    // Functions needed to update the state when passing props in to question template
    this.onAnswerSelect = this.onAnswerSelect.bind(this)
  }

  // Determines if answer was correct or not, and whether to proceed to next question or be done.
  onAnswerSelect(isCorrect) {
    this.props.dispatch(onAnswerSelect(isCorrect, this.props.inGameData.questionNo, this.props.inGameData.noOfCorrect, this.props.accesstoken))
  }

  render(props) {
    let style = {
      fontSize: 100
    }

    let artist = []
    let songs = []
    let inGameData = {}
    let loading
    let errors = false
    let error

    let theGameView
    let loadingView
    let errorView

    if (this.props.artist) {
      artist = this.props.artist
    }

    if (this.props.songs) {
      songs = this.props.songs
    }

    if (this.props.inGameData) {
      inGameData = this.props.inGameData
      loading = this.props.loading
    }

    // In case an error occurs, will populate in error message.
    if (this.props.userError) {
      error = this.props.userError
    } else if (this.props.artistError) {
      error = this.props.artistError
    } else if (this.props.songsError) {
      error = this.props.songsError
    } else if (this.props.inGameDataError) {
      error = this.props.inGameDataError
    }

    // When data is retrieving...
    loadingView = (
      <div style = {style}>
        <i className="fa fa-circle-o-notch fa-spin"/><br/>
        LOADING...
      </div>
    )

    // If an error happens at any point. Will want to edit this so the error is specific
    errorView = (
      <div>
        ERROR! {error}
      </div>
    )

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
        { !errors ? (
          <div>
          {/* Display screens based on whether data is loading */}
          { !loading ? (
            <div>
              {/* Display the difficulty screen - the main one */}
              { !inGameData.gameInProgress && !inGameData.resultsReady && inGameData.gameDifficulty == null &&
                <div>
                  <GameDifficulty
                    username = { this.props.loggedInUserId }
                  />
                </div>
              }

              {/* Display the instructions OR the in game view */}
              { !inGameData.gameInProgress && !inGameData.resultsReady && inGameData.gameDifficulty ? (
                <div>
                  <ModalGreeting
                    username = { this.props.loggedInUserId }
                  />
                  <button type="button" className="btn btn-primary" onClick={() => this.props.dispatch(organizeSongUriAndNames(songs, this.props.accesstoken, this.props.loggedInUserId, artist[0].name))}> 
                    PLAY NOW!
                  </button>

                  <br/>
                </div> ) : theGameView 
              }
            </div> ) : loadingView 
          }
        </div>) : errorView
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
  inGameData: state.inGameData.inGameData,
  loading: state.inGameData.loading,
  userError: state.user.error,
  artistError: state.artist.error,
  songsError: state.songs.error,
  inGameDataError: state.inGameData.error
})

export default connect(mapStateToProps, mapDispatchToProps)(Premium)