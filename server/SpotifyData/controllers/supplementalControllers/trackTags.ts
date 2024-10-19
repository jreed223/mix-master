import { Request as expressRequest, Response as expressResponse} from 'express';
import { Tag } from '../../../types';
type FetchResponse = Response;  //Fetch API Response

export async function fetchTopTags(artist:string, trackName:string): Promise<FetchResponse> {

    const key = "f9135401ee7ea49b6e6416be40440f90"
    let params = new URLSearchParams();
    params.append("api_key", key);
    params.append("artist", decodeURIComponent(artist));
    params.append("track", decodeURIComponent(trackName));
    //console.log("top tags params: ", params)

    
    const playlistItemEndpoint = `https://ws.audioscrobbler.com/2.0/?method=track.gettoptags&${params}&format=json`

    // let params = new URLSearchParams();
    // params.append("api_key", key);
    // params.append("artist", artist);
    // params.append("track", trackName);

    const res = await fetch(playlistItemEndpoint, {
        method: "GET",
    });

    return res


}


export const trackTags = (req: expressRequest, res: expressResponse)=>{
    if(typeof req.headers.artist == "string" && typeof req.headers.track == 'string'){
        const artist = decodeURIComponent(req.headers.artist)
        const track = decodeURIComponent(req.headers.track)
    

    
    
        if(typeof artist == "string" && typeof track == "string"){
            let top4Tags:Tag[] = []

            fetchTopTags(artist, track ).then(async (response: FetchResponse)=>{
                //console.log(`${artist}: `, track)
                if(response.ok){
                    const tagsObject = await response.json()
                    console.log(tagsObject)
                    if(tagsObject.toptags){
                        const tagsList:Tag[] = tagsObject.toptags.tag
                        let i = 0;
                        if(tagsList.length === 0){
                            top4Tags.push({count: 0, name:"Uncategorized", url: "http://localhost:8080/"})
                            // res.status(400).send()
                        }else{
                            while(i<=10&& i < tagsList.length){
                                top4Tags.push(tagsList[i])
                                i++
                            }
                            // res.send(top4Tags)
                        }
                       
                    }else{
                        top4Tags.push({count: 0, name:"Uncategorized", url: "http://localhost:8080/"})
                        // res.status(400).send()
                        //res.send(top4Tags)
                    }
                }else{
                    top4Tags.push({count: 0, name:"Uncategorized", url: "http://localhost:8080/"})
                    //res.send(top4Tags)
                    // res.status(400).send()
                }
                res.send(top4Tags)

            }).catch((e:Error)=>{
                // res.clearCookie('authorizing')
                // res.clearCookie('access_token')
                // res.clearCookie('refresh_token')
                console.error("Fetch operation failed (/lastFM-data/track-tags)): ", e)
            })
        }
    }else{
        console.error("No artist||track found (/spotify-data/audio-features)")

    }
        }