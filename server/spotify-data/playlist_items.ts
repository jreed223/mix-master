import { refreshTokensThenFetch } from "../authentication/AuthHandler";
import type { Playlist, PlaylistItems } from "../types.d.ts";

export async function fetchPlaylistsItems(playlist:Playlist, accessToken:string, refreshToken:string): Promise<PlaylistItems[]|null> {
    const clientId = "002130106d174cc495fc8443cac019f2";

    // const token = getData("access_token");
    // const refreshToken = getData("refresh_token");
    const playlistItemEndpoint = "https://api.spotify.com/v1/playlists/" + playlist.id + "/tracks"

    try{
    const res = await fetch(playlistItemEndpoint, {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });

    if(!res.ok){ //If unable to fetch profile (access token expired)
        if(refreshToken && refreshToken !== 'undefined'){
            const playlistRes = await refreshTokensThenFetch(clientId, refreshToken, playlistItemEndpoint)
            if(playlistRes){
                const playlistObject = await playlistRes.json()
                const playlistItems: PlaylistItems[] = playlistObject["items"];
                    console.log(playlistItems)
                    return playlistItems;
            }else{
                return null
            }

    }
    }

    const playlistObject = await res.json();
    const playlistItems: PlaylistItems[] = playlistObject["items"];
    console.log(playlistItems)
    return playlistItems;
}catch(e){

    console.log(e);
    return null
}

}