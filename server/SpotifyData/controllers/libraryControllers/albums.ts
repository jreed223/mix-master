import { Request as expressRequest, Response as expressResponse} from 'express';
import { Album, AlbumList, Track } from '../../../types';
type FetchResponse = Response;  //Fetch API Response

export async function fetchAlbums(accessToken:string): Promise<FetchResponse> {
    const clientId = "002130106d174cc495fc8443cac019f2";
    // const token = getData("token")
    // const refreshToken = getData("refresh_token");

try{
    
    const res = await fetch("https://api.spotify.com/v1/me/albums", {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });
    //console.log(res.headers)
    return res;

}catch(e){

    console.error("Error in fetchAlbums(): ", e)
    return(Response.error())
}
    


}


export const albums = (req: expressRequest, res: expressResponse)=>{
    const accessToken = req.cookies.access_token? req.cookies.access_token:res.locals.access_token
    //console.log(req.cookies)
    if(accessToken){
        fetchAlbums(accessToken).then(async (response:FetchResponse)=>{
            if(response.ok){
                console.log("OK response from spotify-data/albums")
                const albumssObject:AlbumList = await response.json();
                console.log("albums Object", albumssObject)

                const albumList: Album[] = albumssObject["items"];
                console.log("albums list", albumList)
                const newList =albumList.map((album: Album)=>{return album.album.tracks.items.map((track: Track)=>{track.images = album.album.images
                    return album
                })})
                console.log("NEWLIST: ",newList)
                res.send(albumList)
            }else{
                const error = await response.json()
                console.error("Failed to retrieve playlists (/spotify-data/playlists): ", error)
            }
        })
        .catch(e=>{
            // res.clearCookie('authorizing')
            // res.clearCookie('access_token')
            // res.clearCookie('refresh_token')
            console.error("Fetch operation failed (/spotify-data/playlists)): ", e)
        })
    }else{
        console.error("No access token found (/spotify-data/playlists)")
    }
}