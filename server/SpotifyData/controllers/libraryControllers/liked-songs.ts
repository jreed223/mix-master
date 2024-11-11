import { Request as expressRequest, Response as expressResponse} from 'express';
import { PlaylistItem, Tracklist } from '../../../types';
type FetchResponse = Response;  //Fetch API Response


export async function fetchLikedTracks(accessToken:string): Promise<FetchResponse> {


    const playlistItemEndpoint = "https://api.spotify.com/v1/me/tracks"

    const res = await fetch(playlistItemEndpoint, {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });

    return res


}

export const likedSongs = (req: expressRequest, res: expressResponse)=>{
    let accessToken = req.cookies? req.cookies["access_token"]:null
    console.log(req.cookies)
    fetchLikedTracks(accessToken).then(async (response:FetchResponse)=>{
        if(response.ok){
            console.log("OK response from spotify-data/liked-songs: ",response)
            const playlistsObject: Tracklist = await response.json();
            const playlistList: PlaylistItem[] = playlistsObject.items;
            res.send(playlistList)
        }else{
            const error = await response.json()
            console.error("issue fetching liked songs:", error)
        }
    })
    .catch((e:Error)=>{
        // res.clearCookie('authorizing')
        // res.clearCookie('access_token')
        // res.clearCookie('refresh_token')
        console.log("Issue fetching liked songs: ", e)
    })
}