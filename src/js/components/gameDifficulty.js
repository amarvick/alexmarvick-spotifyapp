/* File Name: gameDifficulty.js                                     *
 * Description: Welcome screen/game instructions for premium users  */

import React, { Component, StartupActions } from 'react';
import { connect } from 'react-redux';

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
          <h1 className="display-4">Welcome to Marvify!</h1>
          <p className="lead">Hello, {this.props.username}! Thank you for taking the time to check out my game. How obsessed do you believe you are with your favorite artist's songs?</p>
        
          <div>
            <button className="btn btn-success lead" onClick={ () => this.props.dispatch(selectDifficulty('Easy')) }> Artists? You mean 'artist'? (Easy) </button><br/>
            <button className="btn btn-warning lead" onClick={ () => this.props.dispatch(selectDifficulty('Medium')) }> I think I'm mildly obsessed! (Medium) </button><br/>
            <button className="btn btn-danger lead" onClick={ () => this.props.dispatch(selectDifficulty('Hard')) }> Extremely obsessed! (Difficult) </button><br/>
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