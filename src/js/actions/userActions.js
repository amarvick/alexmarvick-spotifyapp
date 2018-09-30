/* File Name: userActions.js                                        *
 * Description: Retrieves the logged in user & his/her information  */

import Spotify from 'spotify-web-api-js'
import { loadingComplete } from './inGameActions'

import UserActionTypes from '../actionTypes/userActionTypes'

const spotifyApi = new Spotify()

// AM - for dispatch functions that have type/payload (16/17, 23/24), consider passing these in to function. See line 26, dispatch(loadingComplete())

export function fetchUser() {
    return function(dispatch) {
        spotifyApi.getMe()
        .then((response) => {
            dispatch({
                type: UserActionTypes.FETCH_USER_SUCCESS,
                payload: response
            })
        })

        .catch((error) => {
            dispatch({
                type: UserActionTypes.FETCH_USER_ERROR,
                payload: error
            })
            dispatch(loadingComplete())
        })
    }
}
