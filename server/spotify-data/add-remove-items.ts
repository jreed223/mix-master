export async function addPlaylistsItems(playlistId:string, accessToken:string): Promise<Response> {


    const playlistItemEndpoint = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks"

    const data = {
        "uris": [
            "string"
        ],
        "position": 0
    }

    const res = await fetch(playlistItemEndpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(data)

    });

    return res


}

export async function removePlaylistsItems(playlistId:string, accessToken:string): Promise<Response> {


    const playlistItemEndpoint = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks"

    const data = {
        "tracks": [
            {
                "uri": "string"
            }
        ],
        "snapshot_id": "string"
    }

    const res = await fetch(playlistItemEndpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(data)

    });

    return res


}