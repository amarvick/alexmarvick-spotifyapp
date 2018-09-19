/* File Name: artistReducer.js                                      *
 * Description: Redux reducer for the artist                        */

export default function reducer(state={
    fetching: false,
    fetched: false,
    artist: [
        {
            artist: null,
            artistId: null
        }
    ],
    error: null,
}, action) {

    switch(action.type) {
        case "FETCH_ARTIST": {
            return {...state,
                fetching: true
            }
        }

        case "FETCH_ARTIST_SUCCESS": {
            return {...state,
                fetching: false,
                fetched: true,
                artist: action.payload
            }
        }

        case "FETCH_ARTIST_ERROR": {
            return {...state,
                fetching: false,
                error: action.payload
            }
        }

        default: {}
    }
    return state
}
