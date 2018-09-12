export default function reducer(state={
    fetching: false,
    fetched: false,
    songs: [
        {
            uri: null,
            name: null
        }
    ],
    error: null,
}, action) {

    switch(action.type) {
        case "FETCH_SONGS": {
            return {...state,
                fetching: true
            }
        }

        case "FETCH_SONGS_SUCCESS": {
            return {...state,
                fetching: false,
                fetched: true,
                songs: action.payload
            }
        }

        case "FETCH_SONGS_ERROR": {
            return {...state,
                fetching: false,
                error: action.payload
            }
        }

        default: {}
    }
    return state
}