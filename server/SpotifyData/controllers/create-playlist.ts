import { Request as expressRequest, Response as expressResponse} from 'express';
import { Playlist } from '../../types';
type FetchResponse = Response;  //Fetch API Response

export async function createPlaylist(accessToken:string, userId:string, playlistName: string, description?:string): Promise<Response> {


    const newPlaylistEndpoint = "https://api.spotify.com/v1/users/" + userId + "/playlists"

    const data = {
        name: playlistName,
        description: "A playlist created using MixMaster!",
        public: false
    }

    const res = await fetch(newPlaylistEndpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(data)

    });

    return res


}

export const newPlaylist = (req: expressRequest, res: expressResponse)=>{
    const accessToken = req.cookies.access_token? req.cookies.access_token:res.locals.access_token
    const playlistName = req.body.playlistName? req.body.playlistName: "Untititled"
    const userId= req.body.id

    
    if(accessToken){

        createPlaylist(accessToken, userId, playlistName).then(async (response: FetchResponse)=>{
            if(response.ok){
                const playlist:Playlist = await (response.json())
                res.send(playlist)
                // res.sendStatus(200)
            }else{
                console.log(response.json())
                res.sendStatus(response.status)
            }
        }

        )

    }else{
        console.error("No access token found (/spotify-data/playlists)")
    }
}