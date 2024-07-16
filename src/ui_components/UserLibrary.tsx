import { useEffect, useState } from "react";
import PlaylistCard, { PlaylistCardProps } from "./PlaylistCard";
import React from "react";
import { CategorizedPlaylist, Playlist } from "../../server/types";
import PlaylistClass from "../models/playlistClass";
import TrackCard from "./TrackCard";
import SelectedPlaylistContainer from "./SelectedPlaylistArea";

// interface UserLibraryProps{
//     stagingState: String
// }

const UserLibrary:React.FC=()=>{
    const [isLoading, setLoading] = useState(true);
    const [playlistList, setPlaylistList] = useState<Playlist[]|null>(null)
    const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistClass|null>(null)
    const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState<PlaylistClass[`tracks`]|null>(null)

    const [stagingState, setStagingState] = useState<String|null>(null)

    // useEffect(()=>{

    //     //setLoading(true);
    //     // if(!playlistList){
    //         fetch("/spotify-data/playlists")
    //     .then(res=>res.json())
    //     .then(playlists=>{
    //         setPlaylistList(playlists)
    //         setLoading(false);
    //     })
    //     // }
        

    //     }
    // ,[])

        const toggleCreation = ()=>{
            // let creationContainer = document.getElementById("creation-container")
            // let libraryContainer = document.getElementById("library-container")
            // creationContainer.style.animation = "shrink-staging 1s"
            // libraryContainer.style.animation = "grow-library 1s"
            setStagingState("closed")
            console.log(stagingState)
        }

    const displayTracks = (playlistSelection: PlaylistClass)=>{
        //console.log("displaytracks ran")
        setStagingState("open")
        setSelectedPlaylist(playlistSelection)
        // playlistSelection.setTracks().then(()=>{
        //     setSelectedPlaylistTracks(playlistSelection.tracks)
        // })
        
        console.log("selected playlist set: ", selectedPlaylist )
        // playlistSelection.setCategories().then(()=>{
        //     console.log("categories set: ",playlistSelection.categories)
        // })
    }

    const hidebutton = {
        display:"none"
    }

    if(!playlistList){
        fetch("/spotify-data/playlists")
        .then(res=>res.json())
        .then(playlists=>{
            setPlaylistList(playlists)
            setLoading(false);
        })
    }


    if(playlistList){
        
        const playlists = playlistList.map(singlePlaylist =>
            <PlaylistCard key={singlePlaylist.id} onSelectedPlaylist={displayTracks} playlist={singlePlaylist} ></PlaylistCard>
            );
       
        if(stagingState===null){
            
            return (
                <div className="main-content-area">
                    <div className="playlist-creation-container-hidden" id="creation-container">
                        <div className="playlist-creation-menu-bar">
                            <button onClick={toggleCreation} style={hidebutton}></button>
                        </div>
                        <div className="playlist-items-containers">

                            <SelectedPlaylistContainer playlist={selectedPlaylist}></SelectedPlaylistContainer>
                            {/* <div className="search-filter-container new-playlist" id="search-filter-div"></div> */}
                            <div className="playlist-draft-container new-playlist" id="drafting-div"></div>
                        </div>
                    </div >
                    <div className="library-container" id="library-container">
                    <p className="library-heading">Library</p>
                    <div className='library-content'>
                        <div className="playlist-content">{playlists}</div>
                        <div className="album-content">{playlists}</div>
                    </div>
                    </div>
                </div>)
            }else if(stagingState==="open"){
                // if(selectedPlaylistTracks){
                //     const tracks = selectedPlaylistTracks.map(singleTrack=>
                //         <TrackCard playlistItem={singleTrack}></TrackCard>
                //     )
        
                
                return (
                    <div className="main-content-area">
                        
                            <div className="playlist-creation-container-new grow-staging" id="creation-container">
                                <div className="playlist-creation-menu-bar">
                                    <button onClick={toggleCreation}></button>
                                </div>
                                <div className="playlist-items-containers">
                                    <SelectedPlaylistContainer playlist={selectedPlaylist}></SelectedPlaylistContainer>

                                    {/* <div className="search-filter-container new-playlist" id="search-filter-div" >
                                        <button onClick={toggleCreation}></button>
                                        {tracks}
                                    </div> */}
                                    <div className="playlist-draft-container new-playlist" id="drafting-div"></div>
                                </div >
                            </div>
                        
                            <div className="library-container-new shrink-library" id="library-container">
                                <p className="library-heading">Library</p>
                                <div className='library-content'>
                                    <div className="playlist-content">{playlists}</div>
                                    <div className="album-content">{playlists}</div>
                                </div>
                            </div>
                    </div>)
                // }
            }else if(stagingState==="closed"){
                // if(selectedPlaylistTracks){
                //     const tracks = selectedPlaylistTracks.map(singleTrack=>
                //         <TrackCard playlistItem={singleTrack}></TrackCard>
                //     )
                return (
                    <div className="main-content-area">
                        <div className="playlist-creation-container-hidden shrink-staging" id="creation-container">
                            <div className="playlist-creation-menu-bar">
                                <button onClick={toggleCreation} style={hidebutton}></button>
                            </div>
                            <div className="playlist-items-containers">

                                <SelectedPlaylistContainer playlist={selectedPlaylist}></SelectedPlaylistContainer>

                                {/* <div className="search-filter-container new-playlist" id="search-filter-div" >
                                    <button onClick={toggleCreation}></button>
                                    {tracks}
                                </div> */}
                                <div className="playlist-draft-container new-playlist" id="drafting-div"></div>
                            </div>
                        </div >
                        
                            <div className="library-container grow-library" id="library-container">
                                <p className="library-heading">Library</p>
                                <div className='library-content'>
                                    <div className="playlist-content">{playlists}</div>
                                    <div className="album-content">{playlists}</div>
                                </div>
                            </div>
                    </div>)
            // }
        }
    }else if(isLoading){

        return<p>Loading...</p>
    }else{
        return<p>No playlists found. Plese try again.</p>
    }

}

export default UserLibrary