/* File Name: songReducer.js                                        *
 * Description: Redux reducer for the songs                         */

import SongsActionTypes from '../actionTypes/songsActionTypes'

export default function reducer(state={
    fetched: false,
    songs: [],
    error: null,
}, action) {

    switch(action.type) {
        case SongsActionTypes.FETCH_SONGS_SUCCESS: {
            return {...state,
                fetched: true,
                songs: action.payload
            }
        }

        case SongsActionTypes.FETCH_SONGS_ERROR: {
            return {...state,
                error: action.payload
            }
        }

        default: {}
    }
    return state
}
