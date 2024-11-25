import { Request as expressRequest, Response as expressResponse} from 'express';
import { Album, AlbumList, SearchResults, Track } from '../../../types';
type FetchResponse = Response;  //Fetch API Response

export async function fetchArtistAlbums(accessToken:string, id: string): Promise<FetchResponse> {
    // const token = getData("token")
    // const refreshToken = getData("refresh_token");
    const albumTypes=['single', 'album', 'appears_on', 'compilation']
    const params = new URLSearchParams()
    // params.append("q", query)
    // params.set("include_groups", albumTypes.join(','))
    params.append("limit", "50")
    
try{
    console.log(`https://api.spotify.com/v1/artists/${id}/albums?`+ params)
    
    const res = await fetch(`https://api.spotify.com/v1/artists/${id}/albums?`+ params, {
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


export const artistAlbums = (req: expressRequest, res: expressResponse)=>{
    const accessToken = req.cookies.access_token? req.cookies.access_token:res.locals.access_token
    const artistId= req.body.id
    //console.log(req.cookies)
    if(accessToken){
        fetchArtistAlbums(accessToken, artistId).then(async (response:FetchResponse)=>{
            if(response.ok){
                console.log("OK response from spotify-data/album")
                const albumsResult:SearchResults['albums'] = await response.json();
                
            
                res.send(albumsResult)
            }else{
                const error = await response.json()
                console.error("Failed to retrieve dtata (/spotify-data/playlists): ", error)
            }
        })
        .catch(e=>{
            // res.clearCookie('authorizing')
            // res.clearCookie('access_token')
            // res.clearCookie('refresh_token')
            console.error("Fetch operation failed HERE (/spotify-data/playlists)): ", e)
        })
    }else{
        console.error("No access token found (/spotify-data/playlists)")
    }
}