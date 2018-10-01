/* File Name: premium.js                                            *
 * Description: The game display. For premium users only            */

import React, { Component, StartupActions } from 'react'
import { ButtonToolbar, Button, Modal } from 'react-bootstrap'
import { connect } from 'react-redux'

import ModalGreeting from './modalGreeting'
import QuestionTemplate from './questionTemplate'
import ResultsTemplate from './resultsTemplate'
import GameDifficulty from './gameDifficulty'
import Error from './error'

import { setupGame } from '../actions/inGameActions'
import { onAnswerSelect } from '../actions/inGameActions'

class Premium extends Component {
  constructor(props) {
    super(props)

    this.state = { 
      accesstoken: '',
      username: ''
    }
  }

  render(props) {
    let artist = this.props.artist || []
    let songs = this.props.songs || []
    let inGameData = this.props.inGameData || {}
    let errors = false
    let error = this.props.userError || this.props.artistError || this.props.songsError || this.props.inGameDataError

    let theGameView

    if (error != null) {
      error = String(error)
      errors = true
    }

    // If there is no game difficulty selected, the screen will ask for a difficulty level
    if (inGameData.gameDifficulty == null) {
      theGameView = (
        <GameDifficulty
          username = { this.props.username }
        />
      )
    } else {
      // If no questions are generated yet but a difficulty is selected, prompt instructions screen. Else, in-game screen OR results
      if (inGameData.questions.questions != null && inGameData.questions.questions.length > 0) {
        // If results aren't ready yet, go through questions; otherwise, results screen will display.
        if (!inGameData.resultsReady && !inGameData.didUserCheat) {
          theGameView = ( 
            <QuestionTemplate 
              questionAnswers = { inGameData.questions.questions[inGameData.questionNo] }
              correctResponse = { inGameData.favoriteArtistsSongs.favoriteArtistsSongs.songNames[inGameData.questionNo] }
              questionNumber = { inGameData.questionNo }
              accesstoken = { this.props.accesstoken }
              noOfCorrect = { inGameData.noOfCorrect }
            />
          )
        } else {
          theGameView = ( 
            <ResultsTemplate
              correctCount = { inGameData.noOfCorrect }
              didUserCheat = { inGameData.didUserCheat }
              cheatReasoning = { inGameData.cheatReasoning }
            />
          )
        }
      } else {
        theGameView = ( 
          <ModalGreeting
            username = { this.props.username }
            songs = { songs }
            accesstoken = { this.props.accesstoken }
            artistName = { artist[0].name }
          />
        )
      }
    }

    // If an error happens at any point, display error screen; else, display game view. Will want to edit this so the error is specific
    if (errors) {
      return (      
        <Error
          errorMessage = { error }
        />
      )
    } else {
        return (
          <div className='Premium'>
            { theGameView }
          </div>
        )
      }
  }
}

// wraps dispatch to create nicer functions to call within our component
// Mapping dispatch actions to the props
const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
  startup: () => dispatch(StartupActions.startup()),
  setupGame: (songs, accesstoken, username, artistName) => dispatch(setupGame(songs, accesstoken, username, artistName))
})

// Maps the state in to props (for displaying on the front end)
const mapStateToProps = (state) => ({
  user: state.user.user,
  artist: state.artist.artist,
  songs: state.songs.songs,
  inGameData: state.inGameData.inGameData,
  userError: state.user.error,
  artistError: state.artist.error,
  songsError: state.songs.error,
  inGameDataError: state.inGameData.error
})

export default connect(mapStateToProps, mapDispatchToProps)(Premium)

//mapStateToProps - you have a bunch of stuff on Redux that you want to put in to props for the component