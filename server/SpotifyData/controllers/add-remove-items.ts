import { Request as expressRequest, Response as expressResponse} from 'express';
type FetchResponse = Response;  //Fetch API Response


export async function addPlaylistsItems(accessToken:string, playlistId:string, uriList: string[]): Promise<Response> {


    const playlistItemEndpoint = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks"

    const data = {
        "uris": uriList,
        "position": 0
    }

    const res = await fetch(playlistItemEndpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(data)

    });

    return res


}

export const addTracks = (req: expressRequest, res: expressResponse)=>{
    const accessToken = req.cookies.access_token? req.cookies.access_token:res.locals.access_token
    const items = req.body.uriList? req.body.uriList: []
    const playlistId= req.body.id

    
    if(accessToken){
        if(items.length<=100){
            addPlaylistsItems(accessToken, playlistId, items).then((response: FetchResponse)=>{
                res.sendStatus(response.status)
            }).catch(e=>
                console.error("Fetch operation failed: ", e)
            )

        }else{
            let itemsSubset= [...items];
            while(itemsSubset.length>100 ){
                addPlaylistsItems(accessToken, playlistId, itemsSubset.slice(0, 100)).then((response: FetchResponse)=>{
                    if(response.ok){
                        // res.sendStatus(200)
                    }else{
                        res.sendStatus(response.status)
                    }
                }).catch(e=>
                    console.error("Fetch operation failed: ", e)
                )

                itemsSubset=itemsSubset.slice(101)
            }
            if(itemsSubset.length> 0){
                res.sendStatus(200)
            }else{
                addPlaylistsItems(accessToken, playlistId, itemsSubset).then((response: FetchResponse)=>{
                    if(response.ok){
                        res.sendStatus(200)

                    }else{
                        res.sendStatus(response.status)                    }
                }).catch(e=>
                    console.error("Fetch operation failed: ", e)
                )

            }

        }
       

    }else{
        console.error("No access token found (/spotify-data/playlists)")
    }
}

export async function removePlaylistsItems(playlistId:string, accessToken:string): Promise<Response> {

    const playlistItemEndpoint = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks"

    const data = {
        "tracks": [
            {
                "uri": "string"
            }
        ],
        "snapshot_id": "string"
    }

    const res = await fetch(playlistItemEndpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(data)

    });

    return res


}