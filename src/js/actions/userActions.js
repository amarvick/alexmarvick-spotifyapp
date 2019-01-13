/* File Name: userActions.js                                        *
 * Description: Retrieves the logged in user & his/her information  */

import Spotify from 'spotify-web-api-js'

import { loadingInProgress, loadingComplete } from './inGameActions'

import UserActionTypes from '../actionTypes/userActionTypes'

const spotifyApi = new Spotify()

export function fetchUser() {
    return function(dispatch) {
        dispatch(loadingInProgress())
        spotifyApi.getMe()
        .then((response) => {
            dispatch({
                type: UserActionTypes.FETCH_USER_SUCCESS,
                payload: response
            })
            dispatch(loadingComplete())
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
