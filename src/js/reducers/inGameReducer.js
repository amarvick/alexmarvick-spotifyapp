/* File Name: inGameReducer.js                                      *
 * Description: Redux reducer for the in-game activity              */

import InGameActionTypes from '../actionTypes/inGameActionTypes'

export default function reducer(state={
    inGameData: {
        noOfCorrect: 0,
        questions: [],
        yourResponses: [], // AM - need to work on this. Logs in user's responses
        favoriteArtistsSongs: {
            songUris: [],
            songNames: []
        },
        questionNo: 0,
        gameInProgress: false,
        resultsReady: false,
        didUserCheat: false,
        cheatReasoning: null,
        gameDifficulty: null
    },
    loading: false,
    error: null,
}, action) {

    switch(action.type) {
        case InGameActionTypes.LOADING_INPROGRESS: {
            return {...state,
                loading: true
            }
        }

        case InGameActionTypes.LOADING_COMPLETE: {
            return {...state,
                loading: false
            }
        }

        case InGameActionTypes.SET_GAME_DIFFICULTY: {
            return {...state,
                inGameData: {
                    ...state.inGameData,
                    gameDifficulty: action.payload
                }
            }
        }

        case InGameActionTypes.UPDATE_FAV_ARTIST_SONGS_URIS: {
            return {...state,
                inGameData: {
                    ...state.inGameData,
                    favoriteArtistsSongs: action.payload
                }
            }
        }

        case InGameActionTypes.GET_QUESTIONS: {
            return {...state,
                inGameData:  {
                    ...state.inGameData,
                    questions: action.payload
                }
            }
        }

        case InGameActionTypes.TURN_GAME_ON: {
            return {...state,
                inGameData: {
                    ...state.inGameData,
                    gameInProgress: true,
                    resultsReady: false,
                    didUserCheat: false
                }
            }
        }

        case InGameActionTypes.GENERATE_RESULTS: {
            return {...state,
                inGameData: {
                    ...state.inGameData,
                    gameInProgress: false,
                    resultsReady: true
                }
            }
        }

        case InGameActionTypes.RESTART_GAME: {
            return {...state,
                inGameData: {
                    ...state.inGameData,
                    resultsReady: false,
                    gameDifficulty: null,
                    questions: [],
                    noOfCorrect: 0,
                    questionNo: 0,
                    favoriteArtistsSongs: {
                        songUris: [],
                        songNames: []
                    }
                },
                error: null
            }
        }

        case InGameActionTypes.NEXT_QUESTION: {
            return {...state,
                inGameData: {
                    ...state.inGameData,
                    questionNo: action.payload
                }
            }
        }

        case InGameActionTypes.CORRECT_ANSWER: {
            return {...state,
                inGameData: {
                    ...state.inGameData,
                    noOfCorrect: action.payload
                }
            }
        }

        case InGameActionTypes.USER_CHEATED: {
            return {...state,
                inGameData: {
                    ...state.inGameData,
                    didUserCheat: action.payload
                }
            }
        }

        case InGameActionTypes.ADD_TO_USER_RESPONSE_LOG: {
            return {...state,
                inGameData: {
                    ...state.inGameData,
                    yourResponses: [
                        ...state.inGameData.yourResponses,
                        action.newItem
                    ]
                }
            }
        }

        case InGameActionTypes.INGAME_ERROR: {
            return {...state,
                error: action.payload
            }
        }

        default: {}
    }
    return state
}
