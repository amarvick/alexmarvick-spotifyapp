/* File Name: login.js                                              *
 * Description: Login Screen for User                               */

import React, { Component } from 'react'

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class Login extends Component {

  render() {
    let style = {
      fontSize: 80
    }

    return (
      <div className='App container container-fluid'>
        <Typography variant="display1" style = {style}>
          WELCOME TO SPOTELLIGENCE!
        </Typography>
        <Typography variant="body1">
          PREMIUM USERS! Are you REALLY as big of a fan as your favorite music group?! Find out now!
        </Typography>
        <Button className="btn btn-success" href='https://am-spotify-quiz-api.herokuapp.com/login'>
          Login to Spotify
        </Button> {/* https://am-spotify-quiz-api.herokuapp.com/login */}
      </div>
    )
  }
}
export default Login
