export async function fetchAudioFeatures(trackId:string, accessToken:string): Promise<Response> {


    const audioFeaturesEndpoint = "https://api.spotify.com/v1/audio-features/"+ trackId

    const res = await fetch(audioFeaturesEndpoint, {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });

    return res


}