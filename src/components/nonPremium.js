import React, { Component } from 'react';

class NonPremium extends Component {

  render() {
    return (
      <div className='NonPremium'>
        { this.state.loggedIn &&
          <div>
            Favorite Artist: { this.state.favoriteArtists.artist }
          </div>
        }

        { this.state.loggedIn && this.state.loggedInUser.userProduct !== 'premium' && this.state.loggedInUser.userProduct !== '' &&
          <h2>
            Sorry, this application requires you to be a premium user only. I am currently working on something for non premium users!
          </h2>
        }

      </div>
    )
  }
}
export default NonPremium;