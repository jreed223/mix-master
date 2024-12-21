import React, { createContext, useCallback,  useMemo, useState } from "react"
import TrackClass from "../models/Tracks";
import TrackCollection from "../models/libraryItems";



export type DraftingContextType = {
        displayFeatureMenu: boolean, 
        setDisplayFeatureMenu: React.Dispatch<React.SetStateAction<boolean>>,
        selectedLibraryItem: TrackCollection, 
        setSelectedLibraryItem:React.Dispatch<React.SetStateAction<TrackCollection>>,
        stagedPlaylist: TrackClass[], 
        setStagedPlaylist: React.Dispatch<React.SetStateAction<TrackClass[]>>,
        stagedPlaylistState:TrackClass[][], 
        setStagedPlaylistState: React.Dispatch<React.SetStateAction<TrackClass[][]>>,
        stageTracks: (items: TrackClass[]) => void,
        unstageTracks: (items: TrackClass[]) => void,
        stagingState: 'open'|'closed'
        setStagingState: React.Dispatch<React.SetStateAction<string>>

    displayTracks: (selection: TrackCollection) => void}
    const DraftingContext = createContext<DraftingContextType>(null)

export default function DraftingProvider({ children}){
    const [displayFeatureMenu, setDisplayFeatureMenu] = useState(false)
    const [selectedLibraryItem, setSelectedLibraryItem] = useState<TrackCollection | null>(null)
    const [stagedPlaylist, setStagedPlaylist] = useState<TrackClass[]>([])
    const [stagedPlaylistState, setStagedPlaylistState] = useState<TrackClass[][]>([[]])
    const [stagingState, setStagingState] = useState<'open'|'closed'>("closed")
        



    const displayTracks = useCallback((selection: TrackCollection) => {
        setStagingState("open")

        setSelectedLibraryItem(selection)
        console.log("ITEM SELECTED: ", selection)

        if (selection.id !== selectedLibraryItem?.id) {
            setSelectedLibraryItem(selection)
        }


    },[selectedLibraryItem?.id, setSelectedLibraryItem, setStagingState])

        const stageTracks =useCallback((items:TrackClass[])=>{
            const newStagedPlaylist = stagedPlaylist.concat(items)
            setStagedPlaylist(newStagedPlaylist)
            setStagedPlaylistState(stagedPlaylistState.concat([newStagedPlaylist]))
            setStagingState("open")
            console.log("Added items: ",items)
            console.log("new Staged Playlist: ",newStagedPlaylist)
            console.log(stagedPlaylistState)
    
    
        },[stagedPlaylist, stagedPlaylistState])
    
        const unstageTracks = useCallback((items: TrackClass[]) => {
            const newStagedPlaylist = stagedPlaylist.filter(stagedItem => !items.some(removedItem => removedItem.track.id === stagedItem.track.id))
            setStagedPlaylist(newStagedPlaylist)
            setStagedPlaylistState(stagedPlaylistState.concat([newStagedPlaylist]))
            console.log("Removed items: ", items)
            console.log("new Staged Playlist: ", newStagedPlaylist)
            console.log(stagedPlaylistState)
    
        }, [setStagedPlaylist, setStagedPlaylistState, stagedPlaylist, stagedPlaylistState])

    const context = useMemo(()=>({
        stagingState, setStagingState,
        displayFeatureMenu, setDisplayFeatureMenu,
        selectedLibraryItem, setSelectedLibraryItem,
        stagedPlaylist, setStagedPlaylist,
        stagedPlaylistState,
        setStagedPlaylistState,
        stageTracks,
        unstageTracks,
        displayTracks}),[displayFeatureMenu, displayTracks, selectedLibraryItem, stageTracks, stagedPlaylist, stagedPlaylistState, stagingState, unstageTracks])

    return(
        <DraftingContext.Provider
            value={context}>
            {children}
        </DraftingContext.Provider>
    )
}

export {DraftingContext}