/* File Name: error.js                                              *
 * Description: Error message that would stop the user              */

import React, { Component, StartupActions } from 'react'
import { ButtonToolbar, Button } from 'react-bootstrap'
import { connect } from 'react-redux'

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
        <h1 className="display-4">
          ERROR
        </h1>

        <p className="lead">
          { this.props.errorMessage }
        </p>

        <p className="lead">
          If the above solution did not work, please try refreshing the page. If the problem still persists or if you need help, please reach out amarvick94@gmail.com. Thanks!
        </p>

        <Button onClick={ () => this.props.dispatch(restartGame()) } block>
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