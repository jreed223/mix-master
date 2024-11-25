import { Request as expressRequest, Response as expressResponse} from 'express';
import { Album, AlbumList, Track } from '../../../types';
type FetchResponse = Response;  //Fetch API Response

export async function fetchAlbum(accessToken:string, id: string): Promise<FetchResponse> {
    // const token = getData("token")
    // const refreshToken = getData("refresh_token");

try{
    
    const res = await fetch("https://api.spotify.com/v1/albums/"+ id , {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });
    //console.log(res.headers)
    console.log(res)

    return res;

}catch(e){

    console.error("Error in fetchAlbums(): ", e)
    return(Response.error())
}
    


}


export const album = (req: expressRequest, res: expressResponse)=>{
    const accessToken = req.cookies.access_token? req.cookies.access_token:res.locals.access_token
    const albumId= req.body.id
    //console.log(req.cookies)
    if(accessToken){
        fetchAlbum(accessToken, albumId).then(async (response:FetchResponse)=>{
            if(response.ok){
                console.log("OK response from spotify-data/album")
                const albumObject:Album['album'] = await response.json();
                
            
                res.send(albumObject)
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