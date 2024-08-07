import { Playlist, PlaylistItem } from "../../server/types";
import { getData, refreshTokensThenFetch } from "../authentication/AuthHandler";

export async function fetchPlaylistsItems(playlist:Playlist): Promise<PlaylistItem[]|null> {
    const clientId = "002130106d174cc495fc8443cac019f2";

    const token = getData("access_token");
    const refreshToken = getData("refresh_token");
    const playlistItemEndpoint = "https://api.spotify.com/v1/playlists/" + playlist.id + "/tracks"

    try{
    const result = await fetch(playlistItemEndpoint, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    if(!result.ok){ //If unable to fetch profile (access token expired)
        if(refreshToken && refreshToken !== 'undefined'){
            const playlistObject = await refreshTokensThenFetch(clientId, refreshToken, playlistItemEndpoint);
            const playlistItems: PlaylistItem[] = playlistObject["items"];
            console.log(playlistItems)
            return playlistItems;
    }
    }

    const playlistObject = await result.json();
    const playlistItems: PlaylistItem[] = playlistObject["items"];
    console.log(playlistItems)
    return playlistItems;
}catch(e){

    console.log(e);

}

}