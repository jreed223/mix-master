import { useEffect, useState } from "react";
import { fetchPlaylists } from "../getData/library";
import PlaylistCard from "./PlaylistCard";
import React from "react";

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
        return (
            <div>
                <h2>Library</h2>
                <div className='library-container'>{playlists}</div>
            </div>)
    }else if(isLoading){
        return<p>Loading...</p>
    }else{
        return<p>No playlists found. Plese try again.</p>
    }

}