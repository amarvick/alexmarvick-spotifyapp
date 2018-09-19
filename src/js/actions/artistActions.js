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
            let thePayload = [];

            if (difficulty === 'Easy') {
                thePayload.push(response.items[0])
            } else if (difficulty === 'Medium') {
                var randomInt = Math.floor(Math.random() * response.items.length);
                thePayload.push(response.items[randomInt])
            } else if (difficulty === 'Hard') {
                thePayload.push(response.items)
            }

            dispatch({
                type: "FETCH_ARTIST_SUCCESS",
                payload: thePayload
            })
            
            console.log(thePayload[0])

            if (difficulty === 'Hard') {
                dispatch(fetchSongs(thePayload[0], 'US'));
            } else if (difficulty === 'Easy' || difficulty === 'Medium') {
                dispatch(fetchSongs(thePayload, 'US'))
            }
        })

        .catch((error) => {
            dispatch({
                type: "FETCH_ARTIST_ERROR",
                payload: error
            })
        })
    }
}
