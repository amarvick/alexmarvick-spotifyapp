export default function reducer(state={
    inGameData: {
        // noOfCorrect: 0,
        questions: [],
        // questionNo: 0,
        gameInProgress: false,
        resultsReady: false,
        didUserCheat: false
    },
    error: null,
}, action) {

    switch(action.type) {
        case "FETCH_INGAMEDATA_GETQUESTIONS": {
            return {...state,
                inGameData: action.payload
                // {
                //     gameInProgress: !gameInProgress
                // }
            }
        }

        case "FETCH_INGAMEDATA_GAMEON": {
            return {...state,
                inGameData: action.payload
                // {
                //     gameInProgress: true,
                //     resultsReady: false
                // }
            }
        }

        case "FETCH_INGAMEDATA_GAMEOFF": {
            return {...state,
                inGameData: action.payload
                // {
                //     gameInProgress: false
                // }
            }
        }

        case "FETCH_INGAMEDATA_RESULTSREADY": {
            return {...state,
                inGameData: action.payload
                // {
                //     resultsReady: true,
                //     gameInProgress: false
                // }
            }
        }

        case "FETCH_INGAMEDATA_NEXTQUESTION": {
            return {...state,
                inGameData: action.payload
                // {
                //     questionNo: questionNo++
                // }
            }
        }

        case "FETCH_INGAMEDATA_CORRECTANSWER": {
            return {...state,
                inGameData: action.payload
                // {
                //     noOfCorrect: noOfCorrect++
                // }
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