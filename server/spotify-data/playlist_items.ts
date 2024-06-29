
export async function fetchPlaylistsItems(playlistId:string, accessToken:string): Promise<Response> {


    const playlistItemEndpoint = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks"

    const res = await fetch(playlistItemEndpoint, {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });

    return res


}