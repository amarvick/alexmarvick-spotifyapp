/* File Name: artistReducer.js                                      *
 * Description: Redux reducer for the artist                        */

import ArtistActionType from '../actionTypes/artistActionType'

export default function reducer(state={
    fetched: false,
    artist: [],
    error: null,
}, action) {

    switch(action.type) {
        case ArtistActionType.FETCH_ARTIST_SUCCESS: {
            return {...state,
                fetched: true,
                artist: action.payload
            }
        }

        case ArtistActionType.FETCH_ARTIST_ERROR: {
            return {...state,
                error: action.payload
            }
        }

    }
    return state
}
