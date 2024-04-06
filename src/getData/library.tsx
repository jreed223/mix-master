import React, { useEffect, useState } from 'react';
import { getData, getRefreshToken, refreshTokensThenFetch } from '../authentication/AuthHandler';
import PlaylistCard from '../ui_components/PlaylistCard';

export async function fetchPlaylists(token: string): Promise<Playlist[]|null> {
    const clientId = "002130106d174cc495fc8443cac019f2";

    const refreshToken = getData("refresh_token");


    try{
    const result = await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    if(!result.ok){ //If unable to fetch profile (access token expired)
        if(refreshToken && refreshToken !== 'undefined'){
            const playlistsObject = await refreshTokensThenFetch(clientId, refreshToken, "https://api.spotify.com/v1/me/playlists");
            const playlistList: Playlist[] = playlistsObject["items"];
            return playlistList;
    }
    }

    const playlistsObject = await result.json();
    const playlistList: Playlist[] = playlistsObject["items"];
    return playlistList;
}catch(e){

    console.log(e);

}

}


export default function UserLibrary({accessToken}){
    const [isLoading, setLoading] = useState(false);
    const [playlistList, setPlaylistList] = useState<Playlist[]|null>(null)

    useEffect(()=>{

        setLoading(true);
        fetchPlaylists(accessToken).then((result)=>{
            setPlaylistList(result);
            console.log(result)
        setLoading(false)});
    }
    ,[accessToken])

    if(playlistList){
        const playlists = playlistList.map(singlePlaylist =>
            <PlaylistCard playlist={singlePlaylist}></PlaylistCard>
            );
        return <div className='library-container'>{playlists}</div>
    }else if(isLoading){
        return<p>Loading...</p>
    }else{
        return<p>No playlists found. Plese try again.</p>
    }

}