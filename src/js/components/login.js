/* File Name: login.js                                              *
 * Description: Login Screen for User                               */

import React, { Component } from 'react'

class Login extends Component {

  render() {
    let style = {
      fontSize: 80
    }

    return (
      <div className='App container container-fluid'>
        <h1 className="display-4" style = {style}>WELCOME TO SPOTELLIGENCE!</h1>
        <p className="lead">PREMIUM USERS! Are you REALLY as big of a fan as your favorite music group?! Find out now!</p>
        <a className="btn btn-success" href='http://localhost:8888/login'>Login to Spotify</a> {/* https://am-spotify-quiz-api.herokuapp.com/login */}
      </div>
    )
  }
}
export default Login
