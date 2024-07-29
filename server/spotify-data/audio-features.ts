import { PlaylistItem } from './../types.d';
export async function fetchAudioFeatures(playlistItems:PlaylistItem[], accessToken:string): Promise<Response> {
    let trackIdList = []

    for(let item of  playlistItems){
        // console.log(item.track.id)
        trackIdList.push(item.track.id)
    }

    const audioFeaturesEndpoint = "https://api.spotify.com/v1/audio-features?ids="+ trackIdList

  

    // console.log(trackIdList)

    const res = await fetch(audioFeaturesEndpoint, {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });

    return res


}