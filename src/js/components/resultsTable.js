/* File Name: resultsTable.js                                       *
 * Description: The table containing user's responses vs actual     *
 *              answers                                             */

import React, { Component, StartupActions } from 'react'
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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

    // AM - Great solution! Review: https://codesandbox.io/s/yw30jrvq1v
    const tableBody = this.props.yourResponses.map((item, index) => {
        return (
            <TableRow>
                <TableCell className="cellResult">{ item }</TableCell>
                <TableCell className="cellResult">{ this.props.questionAnswers[index] }</TableCell>
                <TableCell className="cellResult">{ item === this.props.questionAnswers[index] ? <span style={ green }>Correct</span> : <span style={ red }>Incorrect</span> }</TableCell>
            </TableRow>
        )
    })

    return (
      <div className = 'resultsTable align-center'>
        <Table style={ tableCenter }>
            <TableHead>
                <TableRow>
                    <TableCell className="cellResult">Your Response</TableCell>
                    <TableCell className="cellResult">Correct Answer</TableCell> 
                    <TableCell className="cellResult">Result</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                { tableBody }
            </TableBody>
        </Table>
      </div>
    )
  }
}

export default ResultsTable