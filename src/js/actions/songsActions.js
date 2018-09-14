import Spotify from 'spotify-web-api-js';
import axios from 'axios';

const spotifyApi = new Spotify(); 

export function fetchSongs(artistId, LocCode) {
    return function(dispatch) {
        spotifyApi.getArtistTopTracks(artistId, LocCode)
        .then((response) => {
            dispatch({
                type: "FETCH_SONGS_SUCCESS",
                payload: response.tracks
            })
        })

        .catch((error) => {
            dispatch({
                type: "FETCH_SONGS_ERROR",
                payload: error
            })
        })
    }
}

// Generates each question
export function generateQuestions(songNames, questions) {
    for (var i = 0; i < 10; i++) {
      var multChoiceOpts = []
      var noQuestionInserted = []
      var isQuestionInserted

      // Add correct answer
      multChoiceOpts.push(songNames[i]);
      noQuestionInserted.push(i); 

      // Add remaining three possible selections
      for (var j = 0; j < 3; j++) {
        isQuestionInserted = false;
        while(!isQuestionInserted) {
          var index = Math.floor(Math.random() * 9)
          
          if (!noQuestionInserted.includes(index)) {
            noQuestionInserted.push(index)
            multChoiceOpts.push(songNames[index])
            isQuestionInserted = true;
          } 
        }
      }
      shuffle(multChoiceOpts);
      questions.push(multChoiceOpts);
    }

    return questions;
  }


  // Randomize the generated playlist order
function shuffle(tracksArray) {
    var currentIndex = tracksArray.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = tracksArray[currentIndex];
      tracksArray[currentIndex] = tracksArray[randomIndex];
      tracksArray[randomIndex] = temporaryValue;
    }
  
    return tracksArray;
  }  

// Create and upload playlist

// AM To do - May need to find better way of organizing everything that goes on? Because this posts the playlist, 
// then does a multitude of other things... 'post playlist' may not be the best function name therefore? Not sure - brainstorm

export function postPlaylist(userId, allSongs, artist, accesstoken) {
    // changes title of playlist depending on whether an artist's first letter is a vowel
    var playlistName;
    const vowels = ['A', 'E', 'I', 'O', 'U'];

    if (vowels.includes(artist[0])) {
        playlistName = 'HOW BIG OF AN ' + artist.toUpperCase() + ' FAN ARE YOU?'
    } else {
        playlistName = 'HOW BIG OF A ' + artist.toUpperCase() + ' FAN ARE YOU?'
    }

    axios({
        url: 'https://api.spotify.com/v1/users/' + userId + '/playlists',
        method: "POST",
        data: {
          name: playlistName,
          public: true
        },
        headers: {
          'Authorization': 'Bearer ' + accesstoken,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          var playlistId = response.data.id;
          var uri = response.data.uri
          addTracksToPlaylist(playlistId, allSongs, uri, accesstoken, userId);
        })
        .catch((error) => {
          alert('ERROR CREATING PLAYLIST: ' + error)
          console.log(error)
        })
}

// Add all tracks to the playlist
export function addTracksToPlaylist(newPlaylistId, allSongs, contextUri, accesstoken, userId) {
    axios({
      url: 'https://api.spotify.com/v1/users/' + userId + '/playlists/' + newPlaylistId + '/tracks/',
      method: "POST",
      data: {
        uris: allSongs
      },
      headers: {
        'Authorization': 'Bearer ' + accesstoken,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        console.log(response);
        playPlaylist(contextUri, accesstoken)
      })
      .catch((error) => {
        alert(error)
        console.log(error)
      })

  }

// Shuffle needs to be removed or the questions and playlist will be out of sync
export function removeShuffle(accesstoken) {
    axios({
        url: 'https://api.spotify.com/v1/me/player/shuffle?state=false',
        method: "PUT",
        headers: {
          'Authorization': 'Bearer ' + accesstoken
        }
      })
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
}

// Plays the playlist from the beginning
export function playPlaylist(contextUri, accesstoken) {
    axios({
      url: 'https://api.spotify.com/v1/me/player/play',
      method: "PUT",
      data: {
        context_uri: contextUri
      },
      headers: {
        'Authorization': 'Bearer ' + accesstoken
      }
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  }

export function playNextTrack(accesstoken) {
    axios({
      url: 'https://api.spotify.com/v1/me/player/next',
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + accesstoken
      }
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
}

export function stopPlaylist(accesstoken) {
    axios({
        url: 'https://api.spotify.com/v1/me/player/pause',
        method: "PUT",
        headers: {
          'Authorization': 'Bearer ' + accesstoken
        }
      })
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })  
}