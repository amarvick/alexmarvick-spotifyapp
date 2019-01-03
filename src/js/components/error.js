/* File Name: error.js                                              *
 * Description: Error message that would stop the user              */

import React, { Component, StartupActions } from 'react'

import Button from '@material-ui/core/Button';
import { connect } from 'react-redux'

import Typography from '@material-ui/core/Typography';

import { restartGame } from '../actions/inGameActions'

class Error extends Component {
  constructor(props) {
    super(props)

    this.state = {
      errorMessage: null
    }
  }

  // The question template
  render(props) {    
    return (
      <div className = 'errorTemplate'>
        <Typography variant="display1">
          ERROR
        </Typography>

        <Typography variant="body1">
          { this.props.errorMessage }
        </Typography>

        <Typography variant="body1">
          If the above solution did not work (if listed), please try refreshing the page. It's possible your access token expired. If the problem still persists or if you need help, please reach out amarvick94@gmail.com. Thanks!
        </Typography>

        <Button onClick={ () => this.props.dispatch(restartGame()) }>
          Try again
        </Button>
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
  inGameData: state.inGameData.inGameData
})

export default connect(mapStateToProps, mapDispatchToProps)(Error)