import React, { useContext, useEffect, useRef, useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import DraftingMenuBar from "./DraftingMenu.tsx";
import SelectedPlaylistContainer from "./Playlists/SelectedPlaylistArea.tsx";
import DraftPlaylistContainer from "./Playlists/DraftPlaylistArea.tsx";
import { ViewContext } from "../../state_management/ViewProvider.tsx";
import { DraftingContext, DraftingContextType } from "../../state_management/DraftingPaneProvider.tsx";
import FilterMenu from "./Filters/FilterMenu.tsx";
import TracklistProvider from "../../state_management/TracklistProvider.tsx";
import TrackClass from "../../models/TrackClass.ts";




export default function DraftingArea({setReloadKey, setDialogText}){


    const {isPlaylistsView, isMobile, isMaxDraftView, setIsMaxDraftView} = useContext(ViewContext)
    const {stagingState} = useContext<DraftingContextType>(DraftingContext)
    const [selectedDraftTracks, setSelectedDraftTracks] = useState<TrackClass[]>([])
    const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState<TrackClass[]>([])
    


    useEffect(()=>{
        if(stagingState==="closed"){
            setIsMaxDraftView(false)
        }
    },[stagingState, setIsMaxDraftView])

    const creationContainer = useRef(null)


    return(
        <TracklistProvider>
        <div ref={creationContainer} className={"playlist-creation-container-hidden"}style={isMaxDraftView?{width: "100%", overflowX: "clip"}:stagingState==="open"?{width:isMobile?"100%":"50%", overflowX: "clip"}:{width:"0%", overflowX: "clip"}} id="creation-container">
        <div style={{width:isMaxDraftView||isMobile?"100vw":"50vw", height: "100%", transition: '1s', backgroundColor: "#141414", display:'flex', flexDirection:"column"}}>
        <DraftingMenuBar setDialogText={setDialogText}  setSelectedPlaylistTracks={setSelectedPlaylistTracks} setSelectedDraftTracks={setSelectedDraftTracks} draftingPaneContainer={creationContainer} ></DraftingMenuBar>

            <div className="playlist-items-containers" style={{position: "relative"}}>
                <SelectedPlaylistContainer selectedTracks={selectedPlaylistTracks} setSelectedTracks={setSelectedPlaylistTracks}></SelectedPlaylistContainer>
                <FilterMenu></FilterMenu>
                <DraftPlaylistContainer selectedTracks={selectedDraftTracks} setSelectedTracks={setSelectedDraftTracks} setDialogText={setDialogText} setReloadKey={setReloadKey}></DraftPlaylistContainer>
            </div >
            </div>
        </div>
        </TracklistProvider>
    )
}