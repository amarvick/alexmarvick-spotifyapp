import React, { Component } from 'react';

class ResultsTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      correctCount: 0,
      didCheat: false
    };
  }

  // The results
  render(props) {

    let cheatMessage = 'You are the fakest fan I\'ve ever seen. Get out of here!'
    let zeroCorrect = 'This isn\'t really your favorite artist, is it?'
    let oneToThreeCorrect = 'You have a bit of a way to go before you can declare this your favorite artist.'
    let fourToSixCorrect = 'Average, but you still have some learning to do...'
    let sevenToNineCorrect = 'Pretty good! Lucky for you, there is still more of your favorite artist to explore!'
    let allCorrect = 'Wow! You really are a big fan of your favorite artist. Well done!'

    let endOfGameMsg;
    
    if (this.state.didCheat) {
      endOfGameMsg = (
        <div>
          { cheatMessage }
        </div>
      )
    } else {
      if (this.state.correctCount === 0) { 
        endOfGameMsg = (
          <div>
            { zeroCorrect }
          </div>
        )
      }
      
      else if (this.state.correctCount >= 1 && this.state.correctCount <= 3) { 
        endOfGameMsg = (
          <div>
            { oneToThreeCorrect }
          </div>
        )
      }

      else if (this.state.correctCount >= 4 && this.state.correctCount <= 6) { 
        endOfGameMsg = (
          <div>
            { fourToSixCorrect }
          </div>
        )
      }

      else if (this.state.correctCount >= 7 && this.state.correctCount <= 9) { 
        endOfGameMsg = (
          <div>
            { sevenToNineCorrect }
          </div>
        )
      }

      else if (this.state.correctCount === 10) { 
        endOfGameMsg = (
          <div>
            { allCorrect }
          </div>
        )
      }
    }

    return (
      <div className = 'resultsTemplate'>
        <h1 className="display-4">RESULTS: { this.props.correctCount }/10</h1>

        {/* {} */}
      </div>
    )
  }
}

export default ResultsTemplate;