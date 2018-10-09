/* File Name: gameDifficulty.js                                     *
 * Description: Welcome screen/game instructions for premium users  */

import React, { Component, StartupActions } from 'react'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux'

import { selectDifficulty } from '../actions/inGameActions'

class GameDifficulty extends Component {
    constructor(props){
        super(props)
 
        this.state = {
            username: ''
        }
    }

    render() {
      return (
        <div className='Modal container'>
            <Typography variant="display1">
                Welcome to Spotelligence!
            </Typography>
            <Typography variant="body1">
                Hello, {this.props.username}! Thank you for taking the time to check out my game. How obsessed do you believe you are with your favorite artist's songs?
            </Typography>
            
            <div>
                <Button onClick={ () => this.props.dispatch(selectDifficulty('Easy')) }>
                    Artists? You mean 'artist'? (Easy)
                </Button>
            </div>
            <div>
                <Button onClick={ () => this.props.dispatch(selectDifficulty('Medium')) }>
                    I think I'm mildly obsessed! (Medium)
                </Button>
            </div>
            <div>
                <Button onClick={ () => this.props.dispatch(selectDifficulty('Hard')) }>
                    Extremely obsessed! (Difficult)
                </Button>
            </div>
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
    user: state.user.user,
    artist: state.artist.artist,
    songs: state.songs.songs,
    inGameData: state.inGameData.inGameData
  })
  
export default connect(mapStateToProps, mapDispatchToProps)(GameDifficulty)