import { Request as expressRequest, Response as expressResponse} from 'express';
type FetchResponse = Response;  //Fetch API Response

export async function fetchSearchResults(accessToken: string, query: string){
    const params = new URLSearchParams()
    params.append("q", query)
    params.append("type", "album, track, playlist, artist")
    params.append("limit", "15")

    const endpoint = "https://api.spotify.com/v1/search?" + params
    try{
    
        const res = await fetch(endpoint, {
            method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
        });
        //console.log(res.headers)
        return res;
    
    }catch(e){
    
        console.error("Error in fetchAlbums(): ", e)
        return(Response.error())
    }
}


export const searchResults = (req: expressRequest, res: expressResponse)=>{
    const query= req.body

}