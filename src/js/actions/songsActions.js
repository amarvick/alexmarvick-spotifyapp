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



export function postPlaylist(userId, allSongs, artist, accesstoken) {
    axios({
        url: 'https://api.spotify.com/v1/users/' + userId + '/playlists',
        method: "POST",
        data: {
          name: 'HOW BIG OF A ' + artist.toUpperCase() + ' FAN ARE YOU?',
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