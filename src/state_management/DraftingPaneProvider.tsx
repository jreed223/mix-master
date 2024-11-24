import React, { createContext, useCallback, useContext, useMemo, useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import TrackClass from "../models/Tracks";
import TrackCollection from "../models/libraryItems";
import { NavigationContext } from "./NavigationProvider";
// import { Button } from "@mui/material";


export type ViewName = 'Dashboard'|"Liked Playlists"|"User Playlists"|"Liked Albums"

export type DraftingContextType = {
    // stagedPlaylistState:TrackClass[][], 
    // setStagedPlaylistState: React.Dispatch<React.SetStateAction<TrackClass[][]>>,
    isMaxDraftView:boolean, 
    setIsMaxDraftView: React.Dispatch<React.SetStateAction<boolean>>,
    displayFeatureMenu: boolean, 
    setDisplayFeatureMenu: React.Dispatch<React.SetStateAction<boolean>>,
    // selectedLibraryItem: TrackCollection, 
    // setSelectedLibraryItem:React.Dispatch<React.SetStateAction<TrackCollection>>,
    // stagedPlaylist: TrackClass[], 
    // setStagedPlaylist: React.Dispatch<React.SetStateAction<TrackClass[]>>,
    displayTracks: (selection: TrackCollection) => void}
    const DraftingContext = createContext<DraftingContextType>(null)

export default function DraftingProvider({setStagingState, children}){
    const [displayFeatureMenu, setDisplayFeatureMenu] = useState(false)
    const [stagedPlaylistState, setStagedPlaylistState] = useState<TrackClass[][]>([[]])
    const [isMaxDraftView, setIsMaxDraftView] = useState(false)
    // const [selectedLibraryItem, setSelectedLibraryItem] = useState<TrackCollection | null>(null)
    // const [stagedPlaylist, setStagedPlaylist] = useState<TrackClass[]>([])

    const {selectedLibraryItem, setSelectedLibraryItem, stagedPlaylist, setStagedPlaylist} = useContext(NavigationContext)

    const displayTracks = useCallback((selection: TrackCollection) => {
        setStagingState("open")

        setSelectedLibraryItem(selection)
        console.log("ITEM SELECTED: ", selection)

        if (selection.id !== selectedLibraryItem?.id) {
            setSelectedLibraryItem(selection)
        }


    },[selectedLibraryItem?.id, setSelectedLibraryItem, setStagingState])

    const context = useMemo(()=>({
        stagedPlaylistState, setStagedPlaylistState,
        isMaxDraftView: isMaxDraftView, setIsMaxDraftView: setIsMaxDraftView,
        displayFeatureMenu, setDisplayFeatureMenu,
        selectedLibraryItem, setSelectedLibraryItem,
        stagedPlaylist, setStagedPlaylist,
        displayTracks}),[displayFeatureMenu, displayTracks, isMaxDraftView, selectedLibraryItem, setSelectedLibraryItem, setStagedPlaylist, stagedPlaylist, stagedPlaylistState])

    return(
        <DraftingContext.Provider
            value={context}>
            {children}
        </DraftingContext.Provider>
    )
}

export {DraftingContext}