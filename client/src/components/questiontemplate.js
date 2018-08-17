import React, { Component } from 'react';

class QuestionTemplate extends Component {
  constructor(props) {
      super(props);
      this.state = {
          questionAnswers: new Array(4)
      };
  }

  render(props) {
    return (
        <div className = 'questionTemplate'>
            <h1>QUESTION: Name the song!</h1>
            <button> { this.props.questionAnswers[0] } </button><br/>
            <button> { this.props.questionAnswers[1] } </button><br/>
            <button> { this.props.questionAnswers[2] } </button><br/>
            <button> { this.props.questionAnswers[3] } </button><br/>
        </div>
    )
  }
}

export default QuestionTemplate;