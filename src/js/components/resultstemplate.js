/* File Name: resultsTemplate.js                                    *
 * Description: The template for post-game results                  */

import React, { Component, StartupActions } from 'react'
import { ButtonToolbar, Button } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import '../../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css'
import { connect } from 'react-redux'

import { restartGame } from '../actions/inGameActions'

class ResultsTemplate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      correctCount: 0,
      didUserCheat: false,
      cheatReasoning: ''
    }
  }

  // The results
  render(props) {

    let cheatMessage = 'You are the fakest fan I\'ve ever seen. Get out of here!'
    let zeroCorrect = 'This isn\'t really your favorite artist, is it?'
    let oneToThreeCorrect = 'You have a bit of a way to go before you can declare this your favorite artist.'
    let fourToSixCorrect = 'Average, but you still have some learning to do...'
    let sevenToNineCorrect = 'Pretty good! Lucky for you, there is still more of your favorite artist to explore!'
    let allCorrect = 'Wow! You really are a big fan of your favorite artist. Well done!'

    let yourResponses = this.props.inGameData.yourResponses || null
    let correctAnswers = this.props.inGameData.favoriteArtistsSongs.favoriteArtistsSongs.songNames || null

    let endOfGameMsg
    
    if (this.props.didCheat) {
      endOfGameMsg = (
        <div>
          { cheatMessage }
          How did you cheat? { this.props.cheatReasoning }
        </div>
      )
    } else {
      if (this.props.correctCount === 0) { 
        endOfGameMsg = (
          <div>
            { zeroCorrect } <br/>
            { yourResponses } <br/>
            { correctAnswers } <br/>
          </div>
        )
      }
      
      else if (this.props.correctCount >= 1 && this.props.correctCount <= 3) { 
        endOfGameMsg = (
          <div>
            { oneToThreeCorrect } <br/>
            { yourResponses } <br/>
            { correctAnswers } <br/>
          </div>
        )
      }

      else if (this.props.correctCount >= 4 && this.props.correctCount <= 6) { 
        endOfGameMsg = (
          <div>
            { fourToSixCorrect } <br/>
            { yourResponses } <br/>
            { correctAnswers } <br/>
          </div>
        )
      }

      else if (this.props.correctCount >= 7 && this.props.correctCount <= 9) { 
        endOfGameMsg = (
          <div>
            { sevenToNineCorrect } <br/>
            { yourResponses } <br/>
            { correctAnswers } <br/>
          </div>
        )
      }

      else if (this.props.correctCount === 10) { 
        endOfGameMsg = (
          <div>
            { allCorrect } <br/>
            { yourResponses } <br/>
            { correctAnswers } <br/>
          </div>
        )
      }
    }

    // AM - redux may come in handy here. Output all results, then have a button clicked on that will return you to the main screen.
    return (
      <div className = 'resultsTemplate'>
        <h1 className="display-4">RESULTS: { this.props.correctCount }/10</h1>

        { endOfGameMsg }

        Check here if you'd like to keep your playlist: <input type="checkbox" /> <br/>

        <button type="button" className="btn btn-success" onClick={ () => this.props.dispatch(restartGame()) }>Play Again?</button>
        <a className="btn btn-danger lead" target="_blank" rel="noopener noreferrer" href="https://github.com/amarvick/alexmarvick-spotifyapp" block>Leave (Redirect to Github)</a>

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
  inGameData: state.inGameData.inGameData
})

export default connect(mapStateToProps, mapDispatchToProps)(ResultsTemplate)