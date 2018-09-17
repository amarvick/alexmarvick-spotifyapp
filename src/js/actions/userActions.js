/* File Name: userActions.js                                        *
 * Description: Retrieves the logged in user & his/her information  */

import Spotify from 'spotify-web-api-js';

const spotifyApi = new Spotify(); 

export function fetchUser() {
    return function(dispatch) {
        spotifyApi.getMe()
        .then((response) => {
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
