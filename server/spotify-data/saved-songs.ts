
export async function fetchLikedTracks(accessToken:string): Promise<Response> {


    const playlistItemEndpoint = "https://api.spotify.com/v1/me/tracks"

    const res = await fetch(playlistItemEndpoint, {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });

    return res


}