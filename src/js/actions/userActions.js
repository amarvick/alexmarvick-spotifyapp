import Spotify from 'spotify-web-api-js';
import axios from 'axios';

const spotifyApi = new Spotify(); 

export function fetchUser() {
    return function(dispatch) {
        spotifyApi.getMe()
        .then((response) => {
            console.log(response);
            dispatch({
                type: "FETCH_USER_SUCCESS",
                payload: response
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