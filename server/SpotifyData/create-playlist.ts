export async function createPlaylist(userId:string, accessToken:string): Promise<Response> {


    const newPlaylistEndpoint = "https://api.spotify.com/v1/users/" + userId + "/playlists"

    const data = {
        "name": "New Playlist",
        "description": "New playlist description",
        "public": false
    }

    const res = await fetch(newPlaylistEndpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(data)

    });

    return res


}