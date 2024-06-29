import type { Playlist, PlaylistItems } from "../types.d.ts";

export async function fetchPlaylistsItems(playlistId:string, accessToken:string, refreshToken:string): Promise<Response> {
    const clientId = "002130106d174cc495fc8443cac019f2";

    // const token = getData("access_token");
    // const refreshToken = getData("refresh_token");
    const playlistItemEndpoint = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks"

    // try{
    const res = await fetch(playlistItemEndpoint, {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });

    return res

    const playlistObject = await res.json();
    const playlistItems: PlaylistItems[] = playlistObject["items"];
    console.log(playlistItems)
    // return playlistItems;
// }catch(e){

//     console.log(e);
//     return null
// }

}