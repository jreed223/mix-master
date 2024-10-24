import { Request as expressRequest, Response as expressResponse} from 'express';
import { playlists } from '../libraryControllers/playlists';
import { SearchResults } from '../../../types';
type FetchResponse = Response;  //Fetch API Response

export async function fetchSearchResults(accessToken: string, query: string){
    const types=['album', 'track', 'artist', 'playlist']
    const params = new URLSearchParams()
    params.append("q", query)
    params.set("type", types.join(','))
    // params.append("type", "artist")
    // params.append("type", "track")
    // params.append("type", "playlist")



    params.append("limit", "50")

    const endpoint = "https://api.spotify.com/v1/search?" + params.toString()
    console.log("SEARCH RESULTS ENDPOINT: ", endpoint)
    try{
    
        const res = await fetch(endpoint, {
            method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log("res:", res)
        //console.log(res.headers)
        return res;
    
    }catch(e){
    
        console.error("Error in fetchAlbums(): ", e)
        return(Response.error())
    }
}


export const searchResults = async (req: expressRequest, res: expressResponse)=>{
    const query= req.body.query
    // console.log("query: ", query)
    const accessToken = req.cookies.access_token? req.cookies.access_token:res.locals.access_token
    if(query&&accessToken){
        const results = await fetchSearchResults(accessToken, query).then(async (response)=>{
            if(response.ok){
                console.log("OK response from spotify-data/next-playlist-items")
                const res : SearchResults  = await response.json();

                return res
                
                // res.send(trackData)
            }else{
                const error = await response.json()
                console.error("Failed to retrieve results ", error)
            }
        }).catch((e: Error)=>{
            console.error("Fetch operation failed (/spotify-data/search-query): ", e)
        })

        res.send(results)
    }

}