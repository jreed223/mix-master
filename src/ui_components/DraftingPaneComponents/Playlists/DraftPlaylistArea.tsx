import React, { useCallback, useContext, useEffect, useState } from "react"
import TrackCard from "../TrackComponents/TrackCard";
import TrackClass from "../../../models/Tracks";
import { NavigationContext } from "../../../state_management/NavigationProvider";
import { DraftingContext } from "../../../state_management/DraftingPaneProvider";

interface DraftPlaylistContainerProps {



}

const DraftPlaylistContainer: React.FC<DraftPlaylistContainerProps> = (props: DraftPlaylistContainerProps) => {


    const [selectedTracks, setSelectedTracks] = useState<TrackClass[]>([])
    const [trackCards, setTrackCards] = useState<React.JSX.Element[] | null>(null)
    const [stagedHistory] = useState<TrackClass[][]>([[]])
    const [undoRedoController, setUndoRedoController] = useState<number>(null)    // const [selectAllState, setSelectAllState] =useState<boolean[]>([])

    // const { stagingState } = useContext(NavigationContext)
    const {selectedLibraryItem, setSelectedLibraryItem, stagedPlaylist, setStagedPlaylist, stagingState, stagedPlaylistState,
        setStagedPlaylistState,} = useContext(NavigationContext)


    const deselectTrack = useCallback((trackId: string) => {
        setSelectedTracks(prev => prev.filter(selectedTrack => selectedTrack.track.id !== trackId))
    }, [])

    const removeStagedItems = useCallback((items: TrackClass[]) => {
        const newStagedPlaylist = stagedPlaylist.filter(stagedItem => !items.some(removedItem => removedItem.track.id === stagedItem.track.id))
        setStagedPlaylist(newStagedPlaylist)
        setStagedPlaylistState(stagedPlaylistState.concat([newStagedPlaylist]))
        console.log("Removed items: ", items)
        console.log("new Staged Playlist: ", newStagedPlaylist)
        console.log(stagedPlaylistState)

    }, [setStagedPlaylist, setStagedPlaylistState, stagedPlaylist, stagedPlaylistState])


    useEffect(() => {
        console.log(stagedPlaylist)
        console.log(stagedPlaylist)

        const editSelectedItemList2 = (checked: boolean, selectedItem: TrackClass) => {
            if (checked) {
                setSelectedTracks(selectedTracks.concat([selectedItem]))
            } else {
                setSelectedTracks(selectedTracks.filter(item => item !== selectedItem))
            }
            console.log(selectedTracks)
        }


        if (stagedPlaylist && stagedPlaylist.length > 0) {
            const tracks = stagedPlaylist.slice().reverse().map(trackClass =>
                <TrackCard deselectTrack={deselectTrack} tracklistArea="draft-playlist" draftTrack={removeStagedItems} key={`drafted-playlist-${trackClass?.track?.id}`} trackClass={trackClass} onSelectedTrack={editSelectedItemList2} displayHidden={false} selectedLibraryItems={selectedTracks}></TrackCard>
            )
            setTrackCards(tracks)
        } else {
            setTrackCards([])
        }
    }, [deselectTrack, removeStagedItems, stagedPlaylist, selectedTracks])


    useEffect(() => {


        function areListsEqual(list1: TrackClass[], list2: TrackClass[]): boolean {
            if (list1.length !== list2.length) return false;
            return list1.every((obj, index) => obj.track.id === list2[index].track.id)

        }
        const listsAreEqual1 = areListsEqual(stagedPlaylist, stagedHistory.at(-1))
        const listsAreEqual2 = areListsEqual(stagedPlaylist, stagedHistory.at(undoRedoController - 1))

        console.log(`stagedTracks: ${stagedPlaylist}, stagedHistory: ${stagedHistory.at(-1)}, equal?: ${listsAreEqual1}`)

        if (!undoRedoController && !listsAreEqual1) {
            stagedHistory.push(stagedPlaylist)
        }
        else if (!listsAreEqual2 && undoRedoController > 0) {
            console.log("RANNN")
            stagedHistory.splice(undoRedoController)
            stagedHistory.push(stagedPlaylist)
            setUndoRedoController(null)
        }

        console.log(`stagedHistory length: ${stagedHistory.length}, undoController :${undoRedoController}`)

        console.log("stagedHistory state: ", stagedHistory)
    }, [stagedPlaylist, stagedHistory, undoRedoController])





    const selectAllClicked = () => {
        setSelectedTracks(stagedPlaylist)

    }

    const deselectAllClicked = () => {
        setSelectedTracks([])
    }

    const undoClicked = () => {
        let stateIdx;
        if (undoRedoController) {
            stateIdx = undoRedoController - 1
            setUndoRedoController(prev => prev - 1)
        } else {
            stateIdx = stagedHistory.length - 1
            setUndoRedoController(stateIdx)
        }
        console.log("undoIdx: ", stateIdx)
        setStagedPlaylist(stagedHistory.at(stateIdx - 1))
    }
    const redoClicked = () => {
        setUndoRedoController(prev => prev + 1 === stagedHistory.length ? null : prev + 1)
        setStagedPlaylist(stagedHistory.at(undoRedoController))


    }



    return (
        <div className="playlist-draft-container new-playlist" style={stagingState === "open" ? { borderRight: "2px solid #141414", transition: "1s", display: "flex", flexDirection: 'column' } : { borderRight: "0px solid #141414", transition: "1s", display: "flex", flexDirection: 'column' }} id="drafting-div">
            {
                <div style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#141414",
                    zIndex: 1,
                     display:"flex",
                    flexDirection:"column"
                }}>

                    <div style={{margin:"auto", flex: "1"}}>

                    {/* <input type="checkbox" readOnly checked={} onClick={()=>{toggleSelectAll()}}/><label>Check all</label> */}
                        <button style={{margin:"auto 10px", flex: "1", borderRadius:'15px'}} onClick={() => { deselectAllClicked() }}>Deselect All</button>
                        <button style={{margin:"auto 10px", flex: "1", borderRadius:'15px'}} onClick={() => { selectAllClicked() }}>Select All</button>
                        <button style={{margin:"auto 10px", flex: "1", borderRadius:'15px'}} onClick={() => { removeStagedItems(selectedTracks); setSelectedTracks([]) }}>Remove Items</button>
                    

                    {stagedPlaylistState.length > 0 ?
                        <>
                            {undoRedoController !== 1 && stagedHistory.length > 1 ? <button style={{margin:"auto 10px", flex: "1", borderRadius:'15px'}} onClick={() => { undoClicked() }}>Undo</button> : <></>}
                            {undoRedoController ? <button style={{margin:"auto 10px", flex: "1", borderRadius:'15px'}} onClick={() => { redoClicked() }}>Redo</button> : <></>}
                        </>
                        : <></>}
                        </div>

                    <input placeholder="Playlist Draft..." type="text" style={{textOverflow: "ellipsis", margin:"4px 15px", fontSize:"1.25em", fontWeight:"bold", border:"none", padding: "0 auto", backgroundColor: "#141414", textAlign:'center', minWidth:"50%", alignSelf:"center", width:"calc(100% - 30px)",}}></input>
                </div>
            }
            <div style={{flex: 1, overflowY: "auto", overflowX: "clip"}}>
            {trackCards}
            </div>
        </div>
    )

    // }
}

export default DraftPlaylistContainer