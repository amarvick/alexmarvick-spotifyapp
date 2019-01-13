/* File Name: modalGreeting.js                                      *
 * Description: Welcome screen/game instructions for premium users  */

import React, { Component, StartupActions } from 'react'

import { setupGame } from '../actions/inGameActions'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class ModalGreeting extends Component {
  render() {
    const padding = {
      paddingBottom: 15
    }

    return (
      <div className='Modal container'>
        <Typography style={padding} variant="display1">
          Welcome to Spotelligence!
        </Typography>

        <Typography style={padding} variant="body1">
          Hello, {this.props.username}! Thank you for taking the time to play my game. This is a 10 question quiz to see how well you know your favorite artist's top songs!
        </Typography>
        
        <Typography style={padding} variant="body1">
          As soon as you click 'play', your spotify account will immediately create a playlist of your top artist's favorite songs. You will be prompted 10 questions, one by one, 
          giving you ten seconds to determine the song. If you guess incorrectly, the question will
          be flagged as incorrect. Otherwise, it will be correct.
        </Typography>
        
        <Typography style={padding} variant="body1">
          Once you are finished, you will receive your results. Good luck!
        </Typography>
        
        <Button onClick={() => this.props.dispatch(setupGame(this.props.songs, this.props.accesstoken, this.props.username, this.props.artistName))}> 
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
