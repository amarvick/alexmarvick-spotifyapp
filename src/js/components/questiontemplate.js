/* File Name: questionTemplate.js  AM - make this 'questionTemplate *
 * Description: The template for each individual question           */

import React, { Component, StartupActions } from 'react'
import { ButtonToolbar, Button, Modal } from 'react-bootstrap'

import { onAnswerSelect } from '../actions/inGameActions'

import { connect } from 'react-redux'

class QuestionTemplate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      questionAnswers: new Array(4),
      correctResponse: '',
      questionNumber: 0,
      accesstoken: '',
      noOfCorrect: 0
    }
  }

  // Validates answer and checks whether to proceed to the next question or produce score
  checkAnswer(userResponse) {
    var isCorrect

    if (this.props.correctResponse === userResponse) {
      isCorrect = true
    } else {
      isCorrect = false
    }

    this.props.dispatch(onAnswerSelect(isCorrect, this.props.questionNumber, this.props.noOfCorrect, this.props.accesstoken, userResponse))
  }

  // The question template
  render(props) {    
    let questionNo = this.props.questionNumber + 1

    return (
      <div className = 'questionTemplate'>
        <h1 className="display-4">QUESTION { questionNo }: What song is this?</h1>

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

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
  startup: () => dispatch(StartupActions.startup()),
  onAnswerSelect: (isCorrect, questionNumber, noOfCorrect, accesstoken) => dispatch(onAnswerSelect(isCorrect, questionNumber, noOfCorrect, accesstoken))
})

export default connect(mapDispatchToProps)(QuestionTemplate)

// export default QuestionTemplate