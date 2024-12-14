import React, { useContext, useEffect, useRef } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import PlaylistMenuBar from "./PlaylistMenu";
import SelectedPlaylistContainer from "./Playlists/SelectedPlaylistArea";
import DraftPlaylistContainer from "./Playlists/DraftPlaylistArea";
import { NavigationContext } from "../../state_management/NavigationProvider";
import { DraftingContext } from "../../state_management/DraftingPaneProvider";
import FilterMenu from "./FilterMenu";
import TracklistProvider from "../../state_management/TracklistProvider";




export default function DraftingArea({setReloadKey, setDialogText}){


    const {isPlaylistsView, isSearching, stagingState, isMobile, isMaxDraftView, setIsMaxDraftView} = useContext(NavigationContext)

    // useEffect(()=>{
    //     if(isPlaylistsView){
    //         setIsMaxDraftView(false)
    //     }
    // },[isPlaylistsView, setIsMaxDraftView])

    useEffect(()=>{
        if(stagingState==="closed"){
            setIsMaxDraftView(false)
        }
    },[stagingState, setIsMaxDraftView])

    const creationContainer = useRef(null)


    return(
        <TracklistProvider>
        <div ref={creationContainer} className={"playlist-creation-container-hidden"}style={isMaxDraftView?{width: "100%", overflowX: "clip"}:stagingState==="open"?{width:isMobile?"100%":"50%", overflowX: "clip"}:{width:"0%", overflowX: "clip"}} id="creation-container">
        <div style={{width:isMaxDraftView||isMobile?"100vw":"50vw", height: "100%", transition: '1s', backgroundColor: "#141414"}}>
        <PlaylistMenuBar  draftingPaneContainer={creationContainer} ></PlaylistMenuBar>

            <div className="playlist-items-containers" style={{position: "relative"}}>
                <SelectedPlaylistContainer></SelectedPlaylistContainer>
                <FilterMenu></FilterMenu>
                <DraftPlaylistContainer setDialogText={setDialogText} setReloadKey={setReloadKey}></DraftPlaylistContainer>
            </div >
            </div>
        </div>
        </TracklistProvider>
    )
}