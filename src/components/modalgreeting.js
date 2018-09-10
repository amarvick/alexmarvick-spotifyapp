import React, { Component } from 'react';

class ModalGreeting extends Component {
  constructor(props){
    super(props);

    this.state = {
      username: ''
    }
  }
  render() {
    return (
      <div className='Modal container'>
        <h1 className="display-4">Welcome to Marvify!</h1>
        <p className="lead">Hello, {this.props.username}! Thank you for taking the time to play my game. This is a 10 question quiz to see how well you know your favorite artist's top songs!</p>
        <p className="lead">As soon as you click 'play', your spotify account will immediately create a playlist of your top artist's favorite songs. You will be prompted 10 questions, one by one, 
        giving you ten seconds to determine the song. If you guess incorrectly or run out of time, the question will
        be flagged as incorrect. Otherwise, it will be correct.
        </p>

        <p className="lead">
        PLEASE NOTE: You must take this quiz in one sitting! If you attempt to click away from the screen or open up your playlist, you will automatically score a 0/10.
        Additionally, if you attempt to pause the song in the middle of any question, that question will be marked as wrong.
        </p>
        <p className="lead">Once you are finished, you will receive your results. Good luck!</p>
      </div>
    )
  }
}
export default ModalGreeting;