import { Request as expressRequest, Response as expressResponse} from 'express';
import { Playlist } from '../../../types';
// import { Playlist } from '../../types';
type FetchResponse = Response;  //Fetch API Response

export async function fetchPlaylists(accessToken:string): Promise<Response> {
    // const clientId = "002130106d174cc495fc8443cac019f2";
    // const token = getData("token")
    // const refreshToken = getData("refresh_token");

try{
    
    const res = await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log(res.headers)
    return res;

}catch(e){

    console.error("Error in fetchPlaylist(): ", e)
    return(Response.error())
}
    

}


export const playlists = (req: expressRequest, res: expressResponse)=>{
    const accessToken = req.cookies.access_token? req.cookies.access_token:res.locals.access_token
    //console.log(req.cookies)
    if(accessToken){
        fetchPlaylists(accessToken).then(async (response: FetchResponse)=>{
            if(response.ok){
                console.log("OK response from spotify-data/playlists")
                const playlistsObject = await response.json();
                
                const playlistList: Playlist[] = playlistsObject["items"];
                res.send(playlistList)
            }else{
                const error = await response.json()
                console.error("Failed to retrieve playlists (/spotify-data/playlists): ", error)
            }
        })
        .catch((e: Error)=>{
            // res.clearCookie('authorizing')
            // res.clearCookie('access_token')
            // res.clearCookie('refresh_token')
            console.error("Fetch operation failed (/spotify-data/playlists)): ", e)
        })
    }else{
        console.error("No access token found (/spotify-data/playlists)")
    }
}