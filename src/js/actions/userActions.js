import Spotify from 'spotify-web-api-js';
import axios from 'axios';

export function fetchUser() {
    return function(dispatch) {
        spotifyApi.getMe()
        .then((response) => {
            dispatch({
                type: "FETCH_USER_SUCCESS",
                payload: response.data
            })
        })

        .catch((error) => {
            dispatch({
                type: "FETCH_USER_ERROR",
                payload: error
            })
        })
    }
}