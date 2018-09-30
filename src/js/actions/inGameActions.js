/* File Name: inGameActions.js                                      *
 * Description: All of the actions which manipulate the state of    *
 *              the game as the user plays; including questions     *
 *              which get generated, if the user cheated, the       *
 *              question they are on, etc.                          */


 
import axios from 'axios'

import { fetchArtistData } from './artistActions'

import InGameActionTypes from '../actionTypes/inGameActionTypes'

// Updates the game difficulty
export function selectDifficulty(difficulty) {
    return function (dispatch) {
        dispatch(loadingInProgress())
        dispatch({
            type: InGameActionTypes.SET_GAME_DIFFICULTY,
            payload: {
                gameDifficulty: difficulty
            }
        })

        dispatch(fetchArtistData(difficulty))
    }
}

// Sets up game
export function setupGame(songs, accesstoken, userId, artistName) {
    return function (dispatch) {
        dispatch(loadingInProgress())
        var theSongUris = []
        var theSongNames = []

        removeShuffle(accesstoken)
        shuffleArray(songs)
        
        theSongUris = dispatch(getSongUris(songs))
        theSongNames = dispatch(getSongNames(songs))
        dispatch({
            type: InGameActionTypes.UPDATE_FAV_ARTIST_SONGS_URIS,
            payload: {
                favoriteArtistsSongs: {
                    songUris: theSongUris,
                    songNames: theSongNames
                }
            }
        })
        
        dispatch(generateQuestions(theSongNames))
        dispatch(createAndPlayPlaylist(userId, theSongUris, artistName, accesstoken))
    }
}

// Following two functions retrieve song URIs and Names, which need to be in the same order for creating the playlist and having correct answers be in sync
export function getSongUris(songs) {
    return function (dispatch) {
        var theSongUris = []

        for (var i = 0; i < 10; i++) {
            theSongUris.push(songs[i].uri)
        }

        return theSongUris
    }
}

export function getSongNames(songs) {
    return function (dispatch) {
        var theSongNames = []

        for (var i = 0; i < 10; i++) {
            theSongNames.push(songs[i].name)
        }

        return theSongNames
    }
}

// Generates each question
export function generateQuestions(songNames) {
    return function (dispatch) {
        var questions = []

        for (var i = 0; i < 10; i++) {
            var multChoiceOpts = []
            var noQuestionInserted = []
            var isQuestionInserted

            // Add correct answer
            multChoiceOpts.push(songNames[i])
            noQuestionInserted.push(i)

            // Add remaining three possible selections
            for (var j = 0; j < 3; j++) {
                isQuestionInserted = false
                while (!isQuestionInserted) {
                    var index = Math.floor(Math.random() * 9)

                    if (!noQuestionInserted.includes(index)) {
                        noQuestionInserted.push(index)
                        multChoiceOpts.push(songNames[index])
                        isQuestionInserted = true
                    }
                }
            }
            shuffleArray(multChoiceOpts)
            questions.push(multChoiceOpts)
        }

        dispatch({
            type: InGameActionTypes.GET_QUESTIONS,
            payload: {
                questions: questions
            }
        })
    }
}

// Create and upload playlist
export function createAndPlayPlaylist(userId, allSongs, artist, accesstoken) {
    return function (dispatch) {
        // changes title of playlist depending on whether an artist's first letter is a vowel
        var playlistName;
        const vowels = ['A', 'E', 'I', 'O', 'U']

        if (artist) {
            if (vowels.includes(artist[0])) {
                playlistName = 'HOW BIG OF AN ' + artist.toUpperCase() + ' FAN ARE YOU?'
            } else {
                playlistName = 'HOW BIG OF A ' + artist.toUpperCase() + ' FAN ARE YOU?'
            }
        } else {
            playlistName = 'HOW BIG OF A SPOTIFY FAN ARE YOU?'
        }

        axios({
            url: 'https://api.spotify.com/v1/users/' + userId + '/playlists',
            method: "POST",
            data: {
                name: playlistName,
                public: true
            },
            headers: {
                'Authorization': 'Bearer ' + accesstoken,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                var playlistId = response.data.id // AM - ask user if they want to keep the playlist. Maybe put this in 'inGameData' or 'songs' reducer? Decide
                var uri = response.data.uri
                dispatch(addTracksToPlaylist(playlistId, allSongs, uri, accesstoken, userId))
            })
            .catch((error) => {
                console.log(error)
            })
    }
}

// Add all tracks to the playlist
export function addTracksToPlaylist(newPlaylistId, allSongs, contextUri, accesstoken, userId) {
    return function (dispatch) {
        axios({
            url: 'https://api.spotify.com/v1/users/' + userId + '/playlists/' + newPlaylistId + '/tracks/',
            method: "POST",
            data: {
                uris: allSongs
            },
            headers: {
                'Authorization': 'Bearer ' + accesstoken,
                'Content-Type': 'application/json'
            }
        })

            .then((response) => {
                console.log(response)
                dispatch(playPlaylist(contextUri, accesstoken))
            })
            .catch((error) => {
                alert(error)
                console.log(error)
            })
    }
}

// Plays the playlist from the beginning
export function playPlaylist(contextUri, accesstoken) {
    return function (dispatch) {
        axios({
            url: 'https://api.spotify.com/v1/me/player/play',
            method: "PUT",
            data: {
                context_uri: contextUri
            },
            headers: {
                'Authorization': 'Bearer ' + accesstoken
            }
        })
            .then((response) => {
                console.log(response)
                dispatch({
                    type: InGameActionTypes.TURN_GAME_ON
                })
                dispatch(loadingComplete())
            })
            .catch((error) => {
                console.log(error)
            })

    }
}

// Shuffle needs to be removed or the questions and playlist will be out of sync
export function removeShuffle(accesstoken) {
    axios({
        url: 'https://api.spotify.com/v1/me/player/shuffle?state=false',
        method: "PUT",
        headers: {
            'Authorization': 'Bearer ' + accesstoken
        }
    })
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
}

// Determines if answer was correct or not, and whether to proceed to next question or be done.
export function onAnswerSelect(isCorrect, questionNum, correctCount, accessToken) {
    return function (dispatch) {
        if (isCorrect) {
            alert('CORRECT!');
            dispatch({
                type: InGameActionTypes.CORRECT_ANSWER,
                payload: correctCount + 1
            })
        } else {
            alert('INCORRECT ANSWER :(')
        }

        // Changes to the next question OR you're finished and the results will be presented.
        if (questionNum < 9) {
            dispatch(loadingInProgress())
            dispatch({
                type: InGameActionTypes.NEXT_QUESTION,
                payload: questionNum + 1
            })
            dispatch(playNextTrack(accessToken))
        } else {
            // AM - fill out payload
            dispatch({
                type: InGameActionTypes.GENERATE_RESULTS
            })
            stopPlaylist(accessToken)
        }
    }
}

// Plays next track
export function playNextTrack(accesstoken) {
    return function (dispatch) {
        axios({
            url: 'https://api.spotify.com/v1/me/player/next',
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + accesstoken
            }
        })
            .then((response) => {
                console.log(response)
                dispatch(loadingComplete())
            })
            .catch((error) => {
                console.log(error)
            })
    }
}

// Stops playlist when game is finished
export function stopPlaylist(accesstoken) {
    axios({
        url: 'https://api.spotify.com/v1/me/player/pause',
        method: "PUT",
        headers: {
            'Authorization': 'Bearer ' + accesstoken
        }
    })
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
}

export function restartGame() {
    return function (dispatch) {
        dispatch({
            type: InGameActionTypes.RESTART_GAME,
        })
    }
}

// Randomize array order (generated playlist, multiple choice questions, etc.)
export function shuffleArray(tracksArray) {
    var currentIndex = tracksArray.length, temporaryValue, randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = tracksArray[currentIndex]
        tracksArray[currentIndex] = tracksArray[randomIndex]
        tracksArray[randomIndex] = temporaryValue
    }

    return tracksArray
}

// Any asynchronous data changes are in progress
export function loadingInProgress() {
    return function (dispatch) {
        // Everything is loaded - can play playlist
        dispatch({
            type: InGameActionTypes.LOADING_INPROGRESS,
            payload: {
                loading: true
            }
        })
    }
}

// AM - Consider using redux-actions - google this
// export const loadingComplete = createAction(LOADING_COMPLETE, {loading: false});  SYNTAX MAY NOT BE CORRECT BUT SIMILAR

// Any asynchronous data changes have finished
export function loadingComplete() {
    return function (dispatch) {
        dispatch({
            type: InGameActionTypes.LOADING_COMPLETE
        })
    }
}