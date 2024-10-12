import { Suspense, useEffect, useRef, useState } from "react";
// import PlaylistCard, { PlaylistCardProps } from "./PlaylistCard";
import React from "react";
import { UserProfile } from '../../server/types';

import Library from "../models/libraryItems";
import CircularProgress from '@mui/material/CircularProgress';
import { AlbumsComponent, LikedPlaylistsComponent, UserPlaylistsComponent } from "./UserLibrary/LibraryComponents";
import DraftingArea from "./DraftingPaneComponents/DraftingPane";



interface UserLibraryProps{
    currentUser: UserProfile
    activeView: string[]
    setActiveView: React.Dispatch<React.SetStateAction<string[]>>
    setDisabledDashboard: React.Dispatch<React.SetStateAction<boolean>>
}

export default function UserLibrary(props:UserLibraryProps){
    
    const [selectedLibraryItem, setSelectedLibraryItem] = useState<Library|null>(null)
    const [stagingState, setStagingState] = useState<string|null>(null)



    const libraryContainer = useRef(null)
    const userItemsContainer = useRef(null)
    const likedItemsContainer = useRef(null)


    const displayTracks = (selection: Library, currentView: string)=>{
        setStagingState("open")
        props.setActiveView([currentView])
        props.setDisabledDashboard(true)
        if(selection.id !== selectedLibraryItem?.id){
            setSelectedLibraryItem(selection)
        }
    }


const [userPlaylistsStyle, setUserPlaylistsStyle] = useState({})
const [likedPlaylistsStyle, setLikedPlaylistsStyle] = useState({})
useEffect(()=>{
    if(stagingState==="closed"){
        props.setDisabledDashboard(false)


    }
}, [props, stagingState])
useEffect(()=>{


    

        switch(props.activeView.at(-1)){
            case "dashboard":
                setLikedPlaylistsStyle({
                    width: "50%",
                    
                    transition: "1s"
                })
                setUserPlaylistsStyle(   {
                    width: "50%",
                    // paddingRight: "25px",
                    transition: "1s"
                })
                break;                
            case "user playlists":
                    setLikedPlaylistsStyle({
                        width: "0%",

                        transition: "1s"
                    })
                    setUserPlaylistsStyle({
                        width: "100%",
                        //paddingRight: "25px",
                        transition: "1s"
                    })
                // }
                break;
            case "liked playlists":
                setLikedPlaylistsStyle({
                    width: "100%",

                    transition: "1s"
                })
                setUserPlaylistsStyle({
                    width: "0%",

                    transition: "1s"
                })
                break;
            case "liked albums":
                setLikedPlaylistsStyle({
                    width: "100%",

                    transition: "1s"
                })
                setUserPlaylistsStyle({
                    width: "0%",
                    
                    transition: "1s"
                })
                break;
        
        }


}, [props.activeView])

// const currentGap = props.activeView.at(-1)==="dashboard"||props.activeView.at(-1)==="user playlists"?"25px": "0px"

        return (
            <div className="main-content-area">
                <DraftingArea selectedLibraryItem={selectedLibraryItem} setStagingState={setStagingState} stagingState={stagingState} setActiveView={props.setActiveView} ></DraftingArea>

                    <div ref={libraryContainer} style={stagingState==="open"?{width:"50%"}:{width:"100%"}} className="library-container" id="library-container">
                            
                            <div ref={userItemsContainer} className="user-library-items" style={userPlaylistsStyle}>
                            <Suspense fallback={<CircularProgress/>}>
                                <UserPlaylistsComponent stagingState={stagingState}activeView={props.activeView} userId={props.currentUser.id} onPlaylistSelection={displayTracks} selectedLibraryItemId={selectedLibraryItem?.id}></UserPlaylistsComponent>
                            </Suspense>
                            </div>
                            <div ref={likedItemsContainer} className="liked-library-items" style={likedPlaylistsStyle}>
                            <Suspense fallback={<CircularProgress/>}>
                                <LikedPlaylistsComponent stagingState={stagingState} activeView={props.activeView} userId={props.currentUser.id} onPlaylistSelection={displayTracks} selectedLibraryItemId={selectedLibraryItem?.id}></LikedPlaylistsComponent>
                            </Suspense>
                            <Suspense fallback={<CircularProgress/>}>
                                <AlbumsComponent stagingState={stagingState} activeView={props.activeView} userId={props.currentUser.id} onPlaylistSelection={displayTracks} selectedLibraryItemId={selectedLibraryItem?.id}></AlbumsComponent>
                            </Suspense>
                            </div>

                    </div>
            </div>)


                        }
