import React, { useContext, useEffect, useRef } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import PlaylistMenuBar from "./PlaylistMenu";
import SelectedPlaylistContainer from "./Playlists/SelectedPlaylistArea";
import DraftPlaylistContainer from "./Playlists/DraftPlaylistArea";
import { NavigationContext } from "../../state_management/NavigationProvider";
import { DraftingContext } from "../../state_management/DraftingPaneProvider";
import FilterMenu from "./FilterMenu";
import TracklistProvider from "../../state_management/TracklistProvider";




export default function DraftingArea({setReloadKey}){


    const {activeView, isSearching, stagingState} = useContext(NavigationContext)
    const {isMaxDraftView, setIsMaxDraftView} = useContext(DraftingContext)

    useEffect(()=>{
        if(activeView){
            setIsMaxDraftView(false)
        }
    },[activeView, setIsMaxDraftView])

    useEffect(()=>{
        if(isSearching){
            setIsMaxDraftView(false)
        }
    },[isSearching, setIsMaxDraftView])

    const creationContainer = useRef(null)


    return(
        <TracklistProvider>
        <div ref={creationContainer} className={"playlist-creation-container-hidden"}style={isMaxDraftView?{width: "100%", overflowX: "clip"}:stagingState==="open"?{width:"50%", overflowX: "clip"}:{width:"0%", overflowX: "clip"}} id="creation-container">
        <div style={{width:isMaxDraftView?"100vw":"50vw", height: "100%", transition: '1s', backgroundColor: "#141414"}}>
        <PlaylistMenuBar  draftingPaneContainer={creationContainer} ></PlaylistMenuBar>

            <div className="playlist-items-containers" style={{position: "relative"}}>
                <SelectedPlaylistContainer></SelectedPlaylistContainer>
                <FilterMenu></FilterMenu>
                <DraftPlaylistContainer setReloadKey={setReloadKey}></DraftPlaylistContainer>
            </div >
            </div>
        </div>
        </TracklistProvider>
    )
}