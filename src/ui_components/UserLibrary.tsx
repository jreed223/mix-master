import { useEffect, useState } from "react";
import { fetchPlaylists } from "../getData/library";
import PlaylistCard from "./PlaylistCard";
import React from "react";

export default function UserLibrary({accessToken, stagingState}){
    const [isLoading, setLoading] = useState(false);
    const [playlistList, setPlaylistList] = useState<Playlist[]|null>(null)
    // const [stagingState, setStatgingState] = useState<String|null>(null)

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
        if(stagingState==null){
            return (
                <div className="main-content-area">
                    <div className="playlist-creation-container-hidden" id="creation-container">

                    </div >
                    <div className="library-container" id="library-container">
                    <h2 className="library-heading">Library</h2>
                    <div className='library-content'>{playlists}</div>
                    </div>
                </div>)
            }else if(stagingState==="new"){
                return (
                    <div className="main-content-area">
                        <div className="playlist-creation-container-new" id="creation-container">

                        </div >
                            <div className="library-container-new" id="library-container">
                                <h2 className="library-heading">Library</h2>
                                <div className='library-content'>{playlists}</div>
                            </div>
                    </div>)
            }
    }else if(isLoading){
        return<p>Loading...</p>
    }else{
        return<p>No playlists found. Plese try again.</p>
    }

}