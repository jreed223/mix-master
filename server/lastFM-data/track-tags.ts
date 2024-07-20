export async function fetchTopTags(artist:string, trackName:string): Promise<Response> {

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