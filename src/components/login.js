import React, { Component } from 'react';

class Login extends Component {

  render() {
    let style = {
      fontSize: 80
    }

    return (
      <div className='App' class='container container-fluid'>
        <h1 class="display-4" style = {style}>WELCOME TO MARVIFY!</h1>
        <p class="lead">PREMIUM USERS! Are you REALLY as big of a fan as your favorite music group?! Find out now!</p>
        <a class="btn btn-success" href='http://localhost:8888/login'>Login to Spotify</a> {/* https://am-spotify-quiz-api.herokuapp.com/login */}
      </div>
    )
  }
}
export default Login;