
export async function fetchPlaylistsItems(playlistId:string, offset:number, accessToken:string): Promise<Response> {
    const limit = 50
    const offsetIdx = limit*offset


    const playlistItemEndpoint = "https://api.spotify.com/v1/playlists/" + playlistId + `/tracks?limit=${limit}&offset=${offsetIdx}`

    const res = await fetch(playlistItemEndpoint, {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });

    return res


}