/* File Name: nonPremium.js                                         *
 * Description: Warning screen for non-premium users/if access      *
 *              token is expired                                    */

import React, { Component } from 'react'

import Typography from '@material-ui/core/Typography';

class NonPremium extends Component {

// AM to do - make the links look nicer. Also, do I want to call 'nonPremium'?

  render() {
    return (
      <div className='NonPremium'>
        <h4 className="display-4">
          Sorry, either you are not a Premium User or your Access Token has expired or is invalid. If the latter is the case, please <a href="https://am-spotify-quiz.herokuapp.com/">sign in</a> again; otherwise <a href="https://www.spotify.com/us/premium/?checkout=false">sign up for Premium</a> to use!
        </h4>
         
        <Typography>
          -Alex Marvick
        </Typography>
        
        <Typography>
          Github: @amarvick
        </Typography>
      </div>
    )
  }
}
export default NonPremium