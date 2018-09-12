import Spotify from 'spotify-web-api-js';
import axios from 'axios';
import { fetchSongs } from './songsActions'

const spotifyApi = new Spotify(); 

export function fetchArtist() {
    return function(dispatch) {
        spotifyApi.getMyTopArtists()
        .then((response) => {
            dispatch({
                type: "FETCH_ARTIST_SUCCESS",
                payload: response.items[0]
            })
            
            dispatch(fetchSongs(response.items[0].id, 'US'));
        })

        .catch((error) => {
            dispatch({
                type: "FETCH_ARTIST_ERROR",
                payload: error
            })
        })
    }
}