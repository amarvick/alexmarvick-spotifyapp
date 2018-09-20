/* File Name: questiontemplate.js                                   *
 * Description: The template for each individual question           */

import React, { Component } from 'react';

class QuestionTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questionAnswers: new Array(4),
      correctResponse: '',
      questionNumber: 0
    };
  }

  // Validates answer and checks whether to proceed to the next question or produce score
  checkAnswer(userResponse) {
    if (this.props.correctResponse === userResponse) {
      this.props.onAnswerSelect(true);
    } else {
      this.props.onAnswerSelect(false);
    }
  }

  // The question template
  render(props) {    
    

    return (
      <div className = 'questionTemplate'>
        <h1 className="display-4">QUESTION { this.props.questionNumber }: What song is this?</h1>
        <button className="btn btn-light lead" data-toggle="modal" data-target="responsePrompt" onClick={ () => this.checkAnswer(this.props.questionAnswers[0]) }> { this.props.questionAnswers[0] } </button><br/>
        <button className="btn btn-light lead" data-toggle="modal" data-target="responsePrompt" onClick={ () => this.checkAnswer(this.props.questionAnswers[1]) }> { this.props.questionAnswers[1] } </button><br/>
        <button className="btn btn-light lead" data-toggle="modal" data-target="responsePrompt" onClick={ () => this.checkAnswer(this.props.questionAnswers[2]) }> { this.props.questionAnswers[2] } </button><br/>
        <button className="btn btn-light lead" data-toggle="modal" data-target="responsePrompt" onClick={ () => this.checkAnswer(this.props.questionAnswers[3]) }> { this.props.questionAnswers[3] } </button><br/>

        <div className="modal fade" id="responsePrompt" tabIndex="-1" role="dialog" aria-labelledby="responsePrompt" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body">
                ...
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>


      </div>

    )
  }
}

export default QuestionTemplate;
