import { Request as expressRequest, Response as expressResponse} from 'express';
import { Track } from '../../../types';
type FetchResponse = Response;  //Fetch API Response

export async function fetchAudioFeatures(playlistItems:Track[], accessToken:string): Promise<FetchResponse> {
    let trackIdList = []
    console.log(playlistItems)
    for(let item of  playlistItems){
        // console.log(item.track.id)
        trackIdList.push(item.id)
    }

    const audioFeaturesEndpoint = "https://api.spotify.com/v1/audio-features?ids="+ trackIdList

  

    // console.log(trackIdList)

    const res = await fetch(audioFeaturesEndpoint, {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });

    return res


}

export const audioFeatures = async (req: expressRequest, res: expressResponse)=>{
    const accessToken = req.cookies.access_token?req.cookies.access_token:res.locals.access_token
    const playlistItems:Track[] = req.body
    console.log("audio features playlist items: ", playlistItems[0])
    if(accessToken&&playlistItems){

        const audiofeatures= await fetchAudioFeatures(playlistItems, accessToken).then(async(response)=>{
            if(response.ok){
                console.log("OK response from spotify-data/audio-features")
                const audioFeaturesObject = await response.json();
                const audioFeatures = audioFeaturesObject.audio_features
                return audioFeatures
            }else{
                const error = await response.json()
                console.error("Failed to retrieve audio features (/spotify-data/audio-features): ", error)
                return
            }
        }).catch((e:Error)=>{
            // res.clearCookie('authorizing')
            // res.clearCookie('access_token')
            // res.clearCookie('refresh_token')
            console.error("Fetch operation failed (/spotify-data/audio-features)): ", e)
        })

        res.send(audiofeatures)
        


    }else{
        console.error("No playlistItems||accessToken found (/spotify-data/audio-features)")

    }
}