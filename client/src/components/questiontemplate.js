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

  checkAnswer(userResponse) {
    if (this.props.correctResponse == userResponse) {
      alert('CORRECT!');
    } else {
      alert('HAHA! Incorrect!');
    }
    
    // Go to next question
    var questionNo = this.props.questionNumber;
    document.getElementById('questionView' + questionNo.toString()).style.display = 'none'
    questionNo++;

    if (questionNo <= 10) {
      this.playNextTrack()
      var idString = 'questionView' + questionNo.toString();
      document.getElementById('questionView' + questionNo.toString()).style.display = 'inline-block'
    } else {
      // Stop playlist, count score
      this.stopPlaylist();
    }
  }

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

  stopPlaylist() {

  }

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