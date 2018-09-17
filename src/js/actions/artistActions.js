/* File Name: artistActions.js                                      *
 * Description: Retrieves the user's top artists, then immediately  *
 *              calls to get that artist's top songs.               */

import Spotify from 'spotify-web-api-js';
import { fetchSongs } from './songsActions'

const spotifyApi = new Spotify(); 

// Retrieve Artist, then songs immediately after
export function fetchArtist() {
    return function(dispatch) {
        spotifyApi.getMyTopArtists()
        .then((response) => {
            dispatch({
                type: "FETCH_ARTIST_SUCCESS",
                payload: response.items[0]
            })
            
            // AM - can you put 'fetchSongs' function in above dispatch after '}'? Try.
            dispatch(fetchSongs(response.items[0].id, 'US'));
        })

        .catch((error) => {
            dispatch({
                type: "FETCH_ARTIST_ERROR",
                payload: error
            })
        })
    }
}
