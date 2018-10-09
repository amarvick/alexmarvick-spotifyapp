/* File Name: modalGreeting.js                                      *
 * Description: Welcome screen/game instructions for premium users  */

import React, { Component, StartupActions } from 'react'

import { setupGame } from '../actions/inGameActions'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class ModalGreeting extends Component {
  constructor(props){
    super(props)

    this.state = {
      username: '',
      songs: [],
      accesstoken: '',
      artistName: ''
    }
  }
  render() {
    return (
      <div className='Modal container'>
        <Typography variant="display1">
          Welcome to Spotelligence!
        </Typography>

        <Typography variant="body1">
          Hello, {this.props.username}! Thank you for taking the time to play my game. This is a 10 question quiz to see how well you know your favorite artist's top songs!
        </Typography>
        
        <Typography variant="body1">
          As soon as you click 'play', your spotify account will immediately create a playlist of your top artist's favorite songs. You will be prompted 10 questions, one by one, 
          giving you ten seconds to determine the song. If you guess incorrectly or run out of time, the question will
          be flagged as incorrect. Otherwise, it will be correct.
        </Typography>
        
        <Typography variant="body1">
          PLEASE NOTE: You must take this quiz in one sitting! If you attempt to click away from the screen or open up your playlist, you will automatically score a 0/10.
          Additionally, if you attempt to pause the song in the middle of any question, that question will be marked as wrong.
        </Typography>
        
        <Typography variant="body1">
          Once you are finished, you will receive your results. Good luck!
        </Typography>
        
        <Button onClick={() => this.props.dispatch(setupGame(this.props.songs, this.props.accesstoken, this.props.username, this.props.artistName, this.state.checked))}> 
          PLAY NOW!
        </Button>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
  startup: () => dispatch(StartupActions.startup()),
  setupGame: (songs, accesstoken, username, artistName) => dispatch(setupGame(songs, accesstoken, username, artistName))
})

export default connect(mapDispatchToProps)(ModalGreeting)
