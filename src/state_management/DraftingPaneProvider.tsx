import React, { createContext, useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import TrackClass from "../models/Tracks";
import TrackCollection from "../models/libraryItems";
// import { Button } from "@mui/material";


export type ViewName = 'Dashboard'|"Liked Playlists"|"User Playlists"|"Liked Albums"

export type DraftingContextType = {
    stagedPlaylistState:TrackClass[][], 
    setStagedPlaylistState: React.Dispatch<React.SetStateAction<TrackClass[][]>>,
    // selectedFeatures: Record<string, number>, 
    // setSelecetedFeatures: React.Dispatch<React.SetStateAction<Record<string, number>>>,
    isMaxDraftView:boolean, 
    setIsMaxDraftView: React.Dispatch<React.SetStateAction<boolean>>,
    currentAudio: {url:string, audio: HTMLAudioElement}, 
    setCurrentAudio: React.Dispatch<React.SetStateAction<{
        url: string;
        audio: HTMLAudioElement;
    }>>,
    displayFeatureMenu: boolean, 
    setDisplayFeatureMenu: React.Dispatch<React.SetStateAction<boolean>>,
    selectedLibraryItem: TrackCollection, 
    setSelectedLibraryItem:React.Dispatch<React.SetStateAction<TrackCollection>>,
    stagedPlaylist: TrackClass[], 
    setStagedPlaylist: React.Dispatch<React.SetStateAction<TrackClass[]>>,
    displayTracks: (selection: TrackCollection) => void}

    const DraftingContext = createContext<DraftingContextType>(null)


export default function DraftingProvider({setStagingState, children}){
    const [displayFeatureMenu, setDisplayFeatureMenu] = useState(false)
    const [stagedPlaylistState, setStagedPlaylistState] = useState<TrackClass[][]>([[]])
    const [isMaxDraftView, setIsMaxDraftView] = useState(false)
    const [currentAudio, setCurrentAudio] = useState<{url:string, audio: HTMLAudioElement}>(null)
    const [selectedLibraryItem, setSelectedLibraryItem] = useState<TrackCollection | null>(null)
    const [stagedPlaylist, setStagedPlaylist] = useState<TrackClass[]>([])
    

    const displayTracks = (selection: TrackCollection) => {
        setStagingState("open")

        setSelectedLibraryItem(selection)
        console.log("ITEM SELECTED: ", selection)

        if (selection.id !== selectedLibraryItem?.id) {
            setSelectedLibraryItem(selection)
        }
    }

    return(
        <DraftingContext.Provider
            value={{
                stagedPlaylistState, setStagedPlaylistState,
                // selectedFeatures, setSelecetedFeatures,
                isMaxDraftView: isMaxDraftView, setIsMaxDraftView: setIsMaxDraftView,
                currentAudio, setCurrentAudio,
                displayFeatureMenu, setDisplayFeatureMenu,
                selectedLibraryItem, setSelectedLibraryItem,
                stagedPlaylist, setStagedPlaylist,
                displayTracks}}>
            {children}
        </DraftingContext.Provider>
    )
}

export {DraftingContext}