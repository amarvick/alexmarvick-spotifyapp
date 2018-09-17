export default function reducer(state={
    inGameData: {
        noOfCorrect: 0,
        questions: [],
        favoriteArtistsSongs: {
            songUris: [],
            songNames: []
        },
        questionNo: 0,
        gameInProgress: false,
        resultsReady: false,
        didUserCheat: false
    },
    error: null,
}, action) {

    switch(action.type) {
        case "INGAMEDATA_UPDATE_FAV_ARTIST_SONGS_URIS": {
            return {...state,
                inGameData: {
                    ...state.inGameData,
                    favoriteArtistsSongs: action.payload
                }
            }
        }

        case "FETCH_INGAMEDATA_GETQUESTIONS": {
            return {...state,
                inGameData:  {
                    ...state.inGameData,
                    questions: action.payload
                }
            }
        }

        case "FETCH_INGAMEDATA_GAMEON": {
            return {...state,
                inGameData: {
                    ...state.inGameData,
                    gameInProgress: true,
                    resultsReady: false,
                    didUserCheat: false
                }
            }
        }

        case "FETCH_INGAMEDATA_GAMEOFF": {
            return {...state,
                inGameData: {
                    ...state.inGameData,
                    gameInProgress: false
                }
            }
        }

        case "FETCH_INGAMEDATA_RESULTSREADY": {
            return {...state,
                inGameData: {
                    ...state.inGameData,
                    gameInProgress: false,
                    resultsReady: true
                }
            }
        }

        case "FETCH_INGAMEDATA_NEXTQUESTION": {
            return {...state,
                inGameData: {
                    ...state.inGameData
                },
                questionNo: action.payload
            }
        }

        case "FETCH_INGAMEDATA_CORRECTANSWER": {
            return {...state,
                inGameData: action.payload
            }
        }

        case "FETCH_INGAMEDATA_USERCHEATED": {
            return {...state,
                inGameData: action.payload
                // {
                //     didUserCheat: true,
                //     resultsReady: true,
                //     gameInProgress: false,
                //     noOfCorrect: 0
                // }
            }
        }

        case "FETCH_INGAMEDATA_OUTPUTSONGS": {
            return {...state,
                inGameData: action.payload
            }
        }

        case "FETCH_INGAMEDATA_ERROR": {
            return {...state,
                error: action.payload
            }
        }

        default: {}
    }
    return state
}