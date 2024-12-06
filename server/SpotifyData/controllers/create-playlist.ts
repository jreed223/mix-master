import { Request as expressRequest, Response as expressResponse} from 'express';
type FetchResponse = Response;  //Fetch API Response

export async function createPlaylist(accessToken:string, userId:string, playlistName: string, description?:string): Promise<Response> {


    const newPlaylistEndpoint = "https://api.spotify.com/v1/users/" + userId + "/playlists"

    const data = {
        "name": playlistName,
        "description": description?description:"A playlist created using MixMaster!",
        "public": false
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

        createPlaylist(accessToken, userId, playlistName).then((response: FetchResponse)=>{
            if(response.ok){
                res.sendStatus(200)
            }else{
                res.sendStatus(403)
            }
        }

        )

    }else{
        console.error("No access token found (/spotify-data/playlists)")
    }
}