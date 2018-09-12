import Spotify from 'spotify-web-api-js';
import axios from 'axios';

const spotifyApi = new Spotify(); 

export function fetchArtist() {
    return function(dispatch) {
        spotifyApi.getMyTopArtists()
        .then((response) => {
            dispatch({
                type: "FETCH_ARTIST_SUCCESS",
                payload: response.items[0]
            })
        })

        .catch((error) => {
            dispatch({
                type: "FETCH_ARTIST_ERROR",
                payload: error
            })
        })
    }
}