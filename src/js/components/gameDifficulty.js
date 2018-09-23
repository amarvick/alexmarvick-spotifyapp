/* File Name: gameDifficulty.js                                     *
 * Description: Welcome screen/game instructions for premium users  */

import React, { Component, StartupActions } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import TheModal from './modal'

import { selectDifficulty } from '../actions/inGameActions'
 
connect((store) => {
    return {
        inGameData: store.inGameData.inGameData
    };
})

class GameDifficulty extends Component {
    constructor(props){
        super(props);
 
        this.state = {
            username: ''
        }

    }

    render() {
      return (
        <div className='Modal container'>
          <h1 className="display-4">Welcome to Spotelligence!</h1>
          <p className="lead">Hello, {this.props.username}! Thank you for taking the time to check out my game. How obsessed do you believe you are with your favorite artist's songs?</p>

          <div>
            <ButtonToolbar>  
                <Button bsStyle="success" onClick={ () => this.props.dispatch(selectDifficulty('Easy')) } block>
                    Artists? You mean 'artist'? (Easy)
                </Button>
                <Button bsStyle="warning" onClick={ () => this.props.dispatch(selectDifficulty('Medium')) } block>
                    I think I'm mildly obsessed! (Medium)
                </Button>
                <Button bsStyle="danger" onClick={ () => this.props.dispatch(selectDifficulty('Hard')) } block>
                    Extremely obsessed! (Difficult)
                </Button>
            </ButtonToolbar> 
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
    nav: state.nav,
    user: state.user.user,
    artist: state.artist.artist,
    songs: state.songs.songs,
    inGameData: state.inGameData.inGameData
  })
  
export default connect(mapStateToProps, mapDispatchToProps)(GameDifficulty);