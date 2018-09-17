/* File Name: userReducer.js                                        *
 * Description: Redux reducer for the user                          */

export default function reducer(state={
    fetching: false,
    fetched: false,
    user: {
        userId: null,
        userProduct: null
    },
    error: null,
}, action) {

    switch(action.type) {
        case "FETCH_USER": {
            return {...state,
                fetching: true
            }
        }

        case "FETCH_USER_SUCCESS": {
            return {...state,
                fetching: false,
                fetched: true,
                user: action.payload
            }
        }

        case "FETCH_USER_ERROR": {
            return {...state,
                fetching: false,
                error: action.payload
            }
        }

        default: {}
    }
    return state
}
