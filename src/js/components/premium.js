/* File Name: premium.js                                            *
 * Description: The game display. For premium users only            */

import React, { Component, StartupActions } from 'react'
import { ButtonToolbar, Button, Modal } from 'react-bootstrap'
import { connect } from 'react-redux'

import ModalGreeting from './modalgreeting'
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
      loggedInUserId: ''
    }
    
    // Functions needed to update the state when passing props in to question template
    this.onAnswerSelect = this.onAnswerSelect.bind(this)
  }

  // Determines if answer was correct or not, and whether to proceed to next question or be done.
  // Use mapDispatchToProps. See example
  onAnswerSelect(isCorrect) {
    this.props.dispatch(onAnswerSelect(isCorrect, this.props.inGameData.questionNo, this.props.inGameData.noOfCorrect, this.props.accesstoken))
  }

  // AM - a lot of stuff in here! May consider componentizing?
  render(props) {
    let style = {
      fontSize: 100
    }

    let artist = this.props.artist || []
    let songs = this.props.songs || []
    let inGameData = this.props.inGameData || {}
    let loading = this.props.loading || null
    let errors = false
    let error

    let theGameView
    let loadingView
    let errorView

    // In case an error occurs, will populate in error message. Put this in to a function
    if (!errors) {
      if (this.props.userError) {
        console.log(this.props.userError)
        error = String(this.props.userError)
        errors = true
      } else if (this.props.artistError) {
        error = String(this.props.artistError)
        errors = true
      } else if (this.props.songsError) {
        error = String(this.props.songsError)
        errors = true
      } else if (this.props.inGameDataError) {
        error = String(this.props.inGameDataError)
        errors = true
      }
    } // If error, return error view

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
        <Error
          errorMessage = { error }
        />
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
    
    // if (errors) { return (<div>errorTemplate</div>) } else { return } format will be better. Simplify this, use more components!
    // Loading, error, game component. Game component can have the four options; game difficulty, greeting, in-game questions, results...

    return (
      <div className='Premium'>
        { !errors ? (
          <div>
          {/* Display screens based on whether data is loading */}
          { !loading ? (
            <div>
              {/* Display the difficulty screen - the main one */}
              { !inGameData.gameInProgress && !inGameData.resultsReady && inGameData.gameDifficulty == null &&
                  <GameDifficulty
                    username = { this.props.loggedInUserId }
                  />
              }

              {/* Display the instructions OR the in game view */}
              { !inGameData.gameInProgress && !inGameData.resultsReady && inGameData.gameDifficulty ? (
                <div>
                  <ModalGreeting
                    username = { this.props.loggedInUserId }
                  />

                  {/* AM - Put this button in the ModalGreeting...  */}
                  <button type="button" className="btn btn-primary" onClick={() => this.props.setupGame(songs, this.props.accesstoken, this.props.loggedInUserId, artist[0].name)}> 
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
  startup: () => dispatch(StartupActions.startup()),
  setupGame: (songs, accesstoken, loggedInUserId, artistName) => dispatch(setupGame(songs, accesstoken, loggedInUserId, artistName)) // See line 155
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

//mapStateToProps - you have a bunch of stuff on Redux that you want to put in to props for the component