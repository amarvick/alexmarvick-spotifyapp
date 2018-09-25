/* File Name: error.js                                              *
 * Description: Error message that would stop the user              */

import React, { Component } from 'react'
import { ButtonToolbar, Button } from 'react-bootstrap'

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
        <h1 className="display-4">ERROR</h1>

        Error: { this.props.errorMessage }

        <p className="lead"> Please try logging in again or refreshing the page. If the problem still persists, please reach out amarvick94@gmail.com</p>
      </div>

    )
  }
}

export default Error
