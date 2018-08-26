import React, { Component } from 'react';

class ResultsTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      correctCount: 0
    };
  }

  // The question template
  render(props) {
    return (
      <div className = 'resultsTemplate'>
        <h1>RESULTS: { this.props.correctCount }/10</h1>
      </div>
    )
  }
}

export default ResultsTemplate;