/* File Name: premium.js                                            *
 * Description: The game display. For premium users only            */

import React, { Component, StartupActions } from 'react'
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux'

import ModalGreeting from './modalGreeting'
import QuestionTemplate from './questionTemplate'
import ResultsTemplate from './resultsTemplate'
import GameDifficulty from './gameDifficulty'
import Error from './error'

import { restartGame } from '../actions/inGameActions'

class Premium extends Component {
  constructor(props) {
    super(props)

    this.state = { 
      accesstoken: '',
      username: ''
    }
  }

  // isConsoleOpen(gameDifficulty, resultsReady, gameInProgress) {
  //   this.opened = true;
  //   if (gameDifficulty == null) {
  //     alert('WARNING! By having your console open, you will not be able to play the game. Please close it before you get to the next screen. If you have it on at any point during the game, you automatically lose.')
  //   } else {
  //     if (!resultsReady) {
  //       if (!gameInProgress) {
  //         alert('PLEASE TURN OFF YOUR CONSOLE! You will be redirected back to the home screen to start over. If you turn on the console at any point during the game, you automatically fail.')
  //         this.props.dispatch(restartGame())
  //       } else {
  //         alert('You automatically lose! Cheater!')
  //       }
  //     }
  //   }
  // }

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

    // // below indicates that the console log is open. This is cheating and will result in an automatic loss
    // var devtools = /./;
    // devtools.toString = function() {
    //   this.isConsoleOpen(inGameData.gameDifficulty, inGameData.resultsReady, inGameData.gameInProgress)
    // }
    // console.log('%c', devtools);

    // var devtools = /./;
    // devtools.toString = function() {
    //   this.opened = true;
    //   if (inGameData.gameDifficulty == null) {
    //     alert('WARNING! By having your console open, you will not be able to play the game. Please close it before you get to the next screen. If you have it on at any point during the game, you automatically lose.')
    //   } else {
    //     if (!inGameData.resultsReady) {
    //       if (!inGameData.gameInProgress) {
    //         alert('PLEASE TURN OFF YOUR CONSOLE! You will be redirected back to the home screen to start over. If you turn on the console at any point during the game, you automatically fail.')
    //         this.props.dispatch(restartGame())
    //       } else {
    //         alert('You automatically lose! Cheater!')
    //       }
    //     }
    //   }
    // }
    // console.log('%c', devtools);

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
  restartGame: () => dispatch(restartGame())
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