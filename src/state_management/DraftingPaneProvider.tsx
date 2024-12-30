import React, { createContext, useCallback,  useMemo, useState } from "react"
import TrackClass from "../models/Tracks";
import TrackCollection from "../models/TrackCollection";
import { Album, Playlist } from "../../server/types";



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
        



    const displayTracks = useCallback(async (selection: TrackCollection | Album['album'] | Playlist) => {
        setStagingState("open")

        if(selection instanceof TrackCollection){
            setSelectedLibraryItem(prev=>(selection.id !== selectedLibraryItem?.id)?selection:prev)

        }else if (selection.type === "album") {
            console.log(selection.href)
            const albumObject: Album['album'] = await fetch("/spotify-data/album", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: selection.id })
                // headers: {"id" : `${this.id}` }
            }).then(async (res) => {
                const album = await res.json()
                return album
            })
            const tracklistClass = new TrackCollection(albumObject)
            console.log('TRACKLIST CLASS: ', tracklistClass)
            setSelectedLibraryItem(tracklistClass)
            setStagingState('open')

        } else if (selection.type === "playlist") {
            const tracklistClass = new TrackCollection(selection)
            setSelectedLibraryItem(tracklistClass)
            setStagingState('open')

        }
        

        // setSelectedLibraryItem(selection)
        console.log("ITEM SELECTED: ", selection)

        // if (selection.id !== selectedLibraryItem?.id) {
        //     setSelectedLibraryItem(selection)
        // }


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