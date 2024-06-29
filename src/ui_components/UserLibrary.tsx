import { useEffect, useState } from "react";
import { fetchPlaylists } from "../getData/library";
import PlaylistCard from "./PlaylistCard";
import React from "react";

export default function UserLibrary({stagingState}){
    const [isLoading, setLoading] = useState(true);
    const [playlistList, setPlaylistList] = useState<Playlist[]|null>(null)
    // const [stagingState, setStatgingState] = useState<String|null>(null)

    useEffect(()=>{

        //setLoading(true);
        fetch("/spotify-data/playlists")
        .then(res=>res.json())
        .then(playlists=>{
            setPlaylistList(playlists)
            setLoading(false);
        })

        }
    ,[])

    if(playlistList){
        const playlists = playlistList.map(singlePlaylist =>
            <PlaylistCard playlist={singlePlaylist}></PlaylistCard>
            );
        if(stagingState==null){
            return (
                <div className="main-content-area">
                    <div className="playlist-creation-container-hidden" id="creation-container">
                    <div className="playlist-draft-container new-playlist" id="drafting-div"></div>
                            <div className="search-filter-container new-playlist" id="search-filter-div"></div>
                    </div >
                    <div className="library-container" id="library-container">
                    <p className="library-heading">Library</p>
                    <div className='library-content'>{playlists}</div>
                    </div>
                </div>)
            }else if(stagingState==="new"){
                return (
                    <div className="main-content-area">
                        <div className="playlist-creation-container-new" id="creation-container">
                            <div className="playlist-draft-container new-playlist" id="drafting-div"></div>
                            <div className="search-filter-container new-playlist" id="search-filter-div"></div>
                        </div >
                        
                            <div className="library-container-new" id="library-container">
                                <p className="library-heading">Library</p>
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