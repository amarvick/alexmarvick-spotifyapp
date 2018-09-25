/* File Name: songsActions.js                                       *
 * Description: Retrieves the user's favorite artist's top songs.   */

import Spotify from 'spotify-web-api-js'
import { loadingComplete } from './inGameActions'

const spotifyApi = new Spotify()

export function fetchSongs(artists, LocCode) {
    var allTracks = []
    return function(dispatch) {
        for (var i = 0; i < artists.length; i++) {
            spotifyApi.getArtistTopTracks(artists[i].id, LocCode) // AM - Testing error feature!!! Change '1' back to 'i'
            .then((response) => {
                allTracks = allTracks.concat(response.tracks)
                console.log(allTracks)

                dispatch({
                    type: "FETCH_SONGS_SUCCESS",
                    payload: allTracks
                })
            })

            .catch((error) => {
                dispatch({
                    type: "FETCH_SONGS_ERROR",
                    payload: error
                })
                dispatch(loadingComplete())
            })

            dispatch(loadingComplete())
        }
    }
}
