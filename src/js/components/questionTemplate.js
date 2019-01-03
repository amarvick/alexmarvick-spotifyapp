/* File Name: questionTemplate.js  AM - make this 'questionTemplate *
 * Description: The template for each individual question           */

import React, { Component, StartupActions } from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

import { onAnswerSelect } from '../actions/inGameActions'

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class QuestionTemplate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      questionAnswers: new Array(4),
      correctResponse: '',
      questionNumber: 0,
      accesstoken: '',
      noOfCorrect: 0,
      show: false,
      userWasCorrect: false,
      userResponse: ''
    }
  }

  handleOpen = (isCorrect, userResponse) => {
    if (isCorrect == true) {
      this.setState({ userWasCorrect: true });
    }

    this.setState({ 
      userResponse: userResponse,
      open: true
    });
  };

  handleClose = (isCorrect, userResponse) => {
    this.setState({ open: false });
    this.props.dispatch(onAnswerSelect(isCorrect, this.props.questionNumber, this.props.noOfCorrect, this.props.accesstoken, this.state.userResponse))

    if (this.state.userWasCorrect) {
      this.setState({ userWasCorrect: false });
    }

    this.setState({ userResponse: '' })
  };

  // Validates answer and checks whether to proceed to the next question or produce score
  checkAnswer(userResponse) {
    var isCorrect

    if (this.props.correctResponse === userResponse) {
      isCorrect = true
    } else {
      isCorrect = false
    }

    this.handleOpen(isCorrect, userResponse);
  }

  // The question template
  render(props) {   
    const { classes } = this.props; 
    let questionNo = this.props.questionNumber + 1

    let responseResult

    if (this.state.userWasCorrect) {
      responseResult = 'Correct!'
    } else {
      responseResult = 'Incorrect...'
    }

    return (
      <div className = 'questionTemplate'>
        <Typography variant="display1">
          QUESTION { questionNo }: What song is this?
        </Typography>

        <div>
          <Button data-toggle="modal" data-target="responsePrompt" onClick={ () => this.checkAnswer(this.props.questionAnswers[0]) }> 
            { this.props.questionAnswers[0] } 
          </Button>
        </div>

        <div>
          <Button data-toggle="modal" data-target="responsePrompt" onClick={ () => this.checkAnswer(this.props.questionAnswers[1]) }>
            { this.props.questionAnswers[1] }
          </Button>
        <div>
        
        </div>
          <Button data-toggle="modal" data-target="responsePrompt" onClick={ () => this.checkAnswer(this.props.questionAnswers[2]) }>
            { this.props.questionAnswers[2] }
          </Button>
        <div>
        
        </div>
          <Button data-toggle="modal" data-target="responsePrompt" onClick={ () => this.checkAnswer(this.props.questionAnswers[3]) }>
            { this.props.questionAnswers[3] }
          </Button>
        </div>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
          disableBackdropClick={true}
          >
          <div style={getModalStyle()} className={classes.paper}>
            { responseResult }<br/>
            <Button onClick={() => this.handleClose(this.state.userWasCorrect)}>
              Next
            </Button>
          </div>
        </Modal> 

      </div>

    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
  startup: () => dispatch(StartupActions.startup()),
  onAnswerSelect: (isCorrect, questionNumber, noOfCorrect, accesstoken) => dispatch(onAnswerSelect(isCorrect, questionNumber, noOfCorrect, accesstoken))
})

export default connect(mapDispatchToProps)(withStyles(styles)(QuestionTemplate));

// export default QuestionTemplate
