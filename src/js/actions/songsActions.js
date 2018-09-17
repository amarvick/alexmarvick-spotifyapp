/* File Name: songsActions.js                                       *
 * Description: Retrieves the user's favorite artist's top songs.   */

import Spotify from 'spotify-web-api-js';

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
