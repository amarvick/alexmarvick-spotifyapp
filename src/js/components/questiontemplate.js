/* File Name: questiontemplate.js                                   *
 * Description: The template for each individual question           */

import React, { Component } from 'react'
import { ButtonToolbar, Button, Modal } from 'react-bootstrap'

class QuestionTemplate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      questionAnswers: new Array(4),
      correctResponse: '',
      questionNumber: 0,
      show: false
    }
  }

  // Validates answer and checks whether to proceed to the next question or produce score
  checkAnswer(userResponse) {
    if (this.props.correctResponse === userResponse) {
      this.props.onAnswerSelect(true)
    } else {
      this.props.onAnswerSelect(false)
    }
  }

  // The question template
  render(props) {    
    return (
      <div className = 'questionTemplate'>
        <h1 className="display-4">QUESTION { this.props.questionNumber }: What song is this?</h1>

        <ButtonToolbar>
          <Button data-toggle="modal" data-target="responsePrompt" onClick={ () => this.checkAnswer(this.props.questionAnswers[0]) } block> 
            { this.props.questionAnswers[0] } 
          </Button>
          <Button data-toggle="modal" data-target="responsePrompt" onClick={ () => this.checkAnswer(this.props.questionAnswers[1]) } block>
            { this.props.questionAnswers[1] }
          </Button>
          <Button data-toggle="modal" data-target="responsePrompt" onClick={ () => this.checkAnswer(this.props.questionAnswers[2]) } block>
            { this.props.questionAnswers[2] }
          </Button>
          <Button data-toggle="modal" data-target="responsePrompt" onClick={ () => this.checkAnswer(this.props.questionAnswers[3]) } block>
            { this.props.questionAnswers[3] }
          </Button>
        </ButtonToolbar>

      </div>

    )
  }
}

export default QuestionTemplate
