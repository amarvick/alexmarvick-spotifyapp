import Spotify from 'spotify-web-api-js';
import React, { Component } from 'react';
import axios from 'axios';

const spotifyApi = new Spotify();

class QuestionTemplate extends Component {
  constructor(props) {
    super(props);
    const params = this.getHashParams();
    const token = params.access_token;

    if (token) {
      spotifyApi.setAccessToken(token);
    }

    this.state = {
      accesstoken: token,
      questionAnswers: new Array(4),
      correctResponse: '',
      questionNumber: 0,
      playlistId: ''
    };
  }

  // Retrieving the access token needed for POST requests
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  // Validates answer and checks whether to proceed to the next question or produce score
  checkAnswer(userResponse) {
    if (this.props.correctResponse == userResponse) {
      this.props.onAnswerSelect(true);
    } else {
      this.props.onAnswerSelect(false);
    }

    if ((this.props.questionNumber) < 10) {
      // Play next track if not the next question
      this.playNextTrack()
    } else {
      // Hide the question view, display the score
      this.stopPlaylist();
    }
  }

  // Plays next track in playlist
  playNextTrack() {
    axios({
      url: 'https://api.spotify.com/v1/me/player/next',
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + this.state.accesstoken
      }
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // Stops playlist at the end of the game
  // AM - does it make more sense to put this in the premium component + passing in props or in here?
  stopPlaylist() {
    axios({
      url: 'https://api.spotify.com/v1/me/player/pause',
      method: "PUT",
      headers: {
        'Authorization': 'Bearer ' + this.state.accesstoken
      }
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // The question template
  render(props) {
    return (
      <div className = 'questionTemplate'>
        <h1>QUESTION { this.props.questionNumber }: What song is this?</h1>
        <button onClick={ () => this.checkAnswer(this.props.questionAnswers[0]) }> { this.props.questionAnswers[0] } </button><br/>
        <button onClick={ () => this.checkAnswer(this.props.questionAnswers[1]) }> { this.props.questionAnswers[1] } </button><br/>
        <button onClick={ () => this.checkAnswer(this.props.questionAnswers[2]) }> { this.props.questionAnswers[2] } </button><br/>
        <button onClick={ () => this.checkAnswer(this.props.questionAnswers[3]) }> { this.props.questionAnswers[3] } </button><br/>
      </div>
    )
  }
}

export default QuestionTemplate;