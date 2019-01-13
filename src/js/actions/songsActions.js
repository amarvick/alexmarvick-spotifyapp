/* File Name: songsActions.js                                       *
 * Description: Retrieves the user's favorite artist's top songs.   */

import Spotify from 'spotify-web-api-js'
import { loadingComplete } from './inGameActions'

import SongsActionTypes from '../actionTypes/songsActionTypes'

const spotifyApi = new Spotify()

export function fetchSongs(artists, LocCode) {
    var allTracks = []
    return function(dispatch) {
        for (var i = 0; i < artists.length; i++) {
            spotifyApi.getArtistTopTracks(artists[i].id, LocCode)
            .then((response) => {
                allTracks = allTracks.concat(response.tracks)
                console.log(allTracks)

                dispatch({
                    type: SongsActionTypes.FETCH_SONGS_SUCCESS,
                    payload: allTracks
                })
            })

            .catch((error) => {
                dispatch({
                    type: SongsActionTypes.FETCH_SONGS_ERROR,
                    payload: error
                })
                dispatch(loadingComplete())
            })

        // AM - make sure songs upload in bulk instead of through a loop. Ask in next code review
        // retrieve from reducer
        // if (!error) {
        //     dispatch({
        //         type: SongsActionTypes.FETCH_SONGS_SUCCESS,
        //         payload: allTracks
        //     })
        // }

        }
        dispatch(loadingComplete())
    }
}
