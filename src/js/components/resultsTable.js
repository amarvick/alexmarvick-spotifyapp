/* File Name: resultsTable.js                                       *
 * Description: The table containing user's responses vs actual     *
 *              answers                                             */

import React, { Component, StartupActions } from 'react'
import { ButtonToolbar, Button, Modal } from 'react-bootstrap'

class ResultsTable extends Component {
  constructor(props) {
    super(props)

    // AM - May not want to pass in props; may want to get this from the reducer in case you want to add more than 10 questions?
    this.state = {
      yourResponses: new Array(10),
      questionAnswers: new Array(10)
    }
  }

  // The question template
  render(props) {
    let green = { color: '#00FF2B' }  
    let red = { color: 'red' }
    let tableCenter = { width: '100%' }

    const tableBody = this.props.yourResponses.map((item, index) => {
        return (
            <tr>
                <td>{ item }</td>
                <td>{ this.props.questionAnswers[index] }</td>
                <td>{ item === this.props.questionAnswers[index] ? <span style={ green }>Correct</span> : <span style={ red }>Incorrect</span> }</td>
            </tr>
        )
    })

    return (
      <div className = 'resultsTable align-center'>
        <table style={ tableCenter }>
            <thead>
                <tr>
                    <th>Your Response</th>
                    <th>Correct Answer</th> 
                    <th>Result</th>
                </tr>
            </thead>
            <tbody>
                { tableBody }
            </tbody>
        </table>
      </div>
    )
  }
}

export default ResultsTable