/* File Name: artistActions.js                                      *
 * Description: Retrieves the user's top artists, then immediately  *
 *              calls to get that artist's top songs.               */

import Spotify from 'spotify-web-api-js';
import { fetchSongs } from './songsActions'

const spotifyApi = new Spotify(); 

// Retrieve Artist, then songs immediately after
export function fetchArtistData(difficulty) {
    return function(dispatch) {
        spotifyApi.getMyTopArtists()
        .then((response) => {
            console.log(response);
            let thePayload = {};

            if (difficulty === 'Easy' || difficulty === 'Hard') {
                thePayload = response.items[0]
            } else if (difficulty === 'Medium') {
                var randomInt = Math.floor(Math.random() * response.items.length);
                thePayload = response.items[randomInt]
            }

            dispatch({
                type: "FETCH_ARTIST_SUCCESS",
                payload: thePayload
            })
            
            // Retrieving songs
            dispatch(fetchSongs(thePayload.id, 'US'));
        })

        .catch((error) => {
            dispatch({
                type: "FETCH_ARTIST_ERROR",
                payload: error
            })
        })
    }
}
