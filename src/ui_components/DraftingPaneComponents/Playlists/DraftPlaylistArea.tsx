import React, { useCallback, useContext, useEffect, useState } from "react"
import TrackCard from "../TrackComponents/TrackCard";
import TrackClass from "../../../models/Tracks";
import { NavigationContext } from "../../../state_management/NavigationProvider";
import { DraftingContext } from "../../../state_management/DraftingPaneProvider";
import { Playlist } from '../../../../server/types';
import { newPlaylist } from '../../../../server/SpotifyData/controllers/create-playlist';
import TrackCollection from "../../../models/libraryItems";
import LibraryItemCard from "../../UserLibrary/LibraryItemCard";
import io from 'socket.io-client';

interface DraftPlaylistContainerProps {
    setReloadKey: React.Dispatch<React.SetStateAction<number>>

}
type submissionStatusState = "pending"|"submitted"|"adding tracks"|"success"|"fail"

const DraftPlaylistContainer: React.FC<DraftPlaylistContainerProps> = (props: DraftPlaylistContainerProps) => {


    const [selectedTracks, setSelectedTracks] = useState<TrackClass[]>([])
    const [trackCards, setTrackCards] = useState<React.JSX.Element[] | null>(null)
    const [stagedHistory] = useState<TrackClass[][]>([[]])
    const [undoRedoController, setUndoRedoController] = useState<number>(null)    // const [selectAllState, setSelectAllState] =useState<boolean[]>([])
    const [playlistName, setPlaylistName] = useState<string>(null)
    const [submissionState, setSubmissionState] = useState<submissionStatusState[]>(null)
    const [newPlaylistId, setNewplaylistId] = useState(null)

    // const { stagingState } = useContext(NavigationContext)
    const {selectedLibraryItem, setSelectedLibraryItem, stagedPlaylist, setStagedPlaylist, stagingState, stagedPlaylistState,
        setStagedPlaylistState,userLibraryItems, setUserLibraryItems, user} = useContext(NavigationContext)


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


useEffect(()=>{
    if((newPlaylistId===selectedLibraryItem?.id)&&submissionState?.at(-1)==="success"){
        setStagedPlaylist([])
        setStagedPlaylistState([])
        setPlaylistName("")
        setSubmissionState(null)
    }
},[newPlaylistId, selectedLibraryItem?.id, setStagedPlaylist, setStagedPlaylistState, submissionState])


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

    const submitDraftPlaylist = async () : Promise<boolean>=>{
        // fetch("spotify-data/create-playlist")
        const createPlaylist = async (): Promise<TrackCollection>  => {
            // console.log(artistProps.item.id)

                const newPlaylist: Playlist = await fetch("/spotify-data/create-playlist", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ playlistName:playlistName, id:user.id })
                    // headers: {"id" : `${this.id}` }
                }).then(async (res) => {
                    if(res.ok){console.log(res)
                        const playlist = await res.json()
                        return playlist
                    }else{
                        return null
                    }
                    
                }).catch(e=>{
                    console.log(e)
                })
                console.log(newPlaylist)
                
                const newCollection = new TrackCollection(newPlaylist)
                
                // setUserLibraryItems([newCollection].concat(userLibraryItems))
                return newCollection
                // const newPlaylistCard =  <LibraryItemCard key={newCollection.id}  libraryItem={newCollection} ownerId={user.id} view={"User Playlists"} ></LibraryItemCard>

        }

        const addItems = async (playlistId: string) : Promise<boolean>=>{
            const uriList = stagedPlaylist.reverse().map(track=>track.track?.uri)

            const itemSubmission = await fetch("/spotify-data/add-tracks", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uriList:uriList, id: playlistId })
                // headers: {"id" : `${this.id}` }
            }).then(async (res) => {
                if(res.ok){
                    return true
                    // const playlist = await res.json()
                    // return playlist
                }else{
                    return false
                }
                
            }).catch(e=>{
                console.log(e)
                return false
            })

            return itemSubmission

        }
        setSubmissionState(["pending"])
        const newPlaylist = await createPlaylist()
        setNewplaylistId(newPlaylist.id)

        if(!newPlaylist){
            setSubmissionState(prev=>prev.concat(["fail"]))
            console.log('Failed to create playlist')
            return false
        }else{
            setSubmissionState(prev=>prev.concat(["submitted"]))
            const isPlaylistSubmitted = await addItems(newPlaylist.id)
            if(isPlaylistSubmitted){
                setSubmissionState(prev=>prev?prev.concat(["success"]):["success"])
                console.log("Items have been added")
                // if(submissionState && submissionState.length>1){
                //     setStagedPlaylist([])
                //     setStagedPlaylistState([])
                // // setPlaylistName("")
                // }
                
                setUserLibraryItems(null)
                props.setReloadKey(prev=>prev+1)
            }else{
                setSubmissionState(prev=>prev?prev.concat(["fail"]):["fail"])
                console.log("Failed to submit items")
            }
            return isPlaylistSubmitted

        }

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
                    

                        {stagedPlaylistState.length > 0 &&!submissionState ?
                        <>
                            {undoRedoController !== 1 && stagedHistory.length > 1 ? <button style={{margin:"auto 10px", flex: "1", borderRadius:'15px'}} onClick={() => { undoClicked() }}>Undo</button> : <></>}
                            {undoRedoController ? <button style={{margin:"auto 10px", flex: "1", borderRadius:'15px'}} onClick={() => { redoClicked() }}>Redo</button> : <></>}
                        </>
                        : <></>}

                        
                        
                        {stagedPlaylist.length>0 &&!submissionState?
                        <button style={{margin:"auto 10px", flex: "1", borderRadius:'15px'}} onClick={()=>submitDraftPlaylist()}>Submit Playlist</button>
                        :<></>}
                        </div>

                    <input placeholder="Playlist Draft..." type="text" onChange={(e)=>setPlaylistName(e.target.value)} value={playlistName} style={{color:"#757575", textOverflow: "ellipsis", margin:"4px 15px", fontSize:"1.25em", fontWeight:"bold", border:"none", padding: "0 auto", backgroundColor: "#141414", textAlign:'center', minWidth:"50%", alignSelf:"center", width:"calc(100% - 30px)",}}></input>
                </div>
            }
            <div style={{flex: 1, overflowY: "auto", overflowX: "clip"}}>
            {submissionState?.at(-1)==="submitted"
                        ?<div>Playlist has been submitted! Tracks are being added. Your user library will reload once all tracks have been added.<button onClick={()=>{ setSubmissionState(null); setStagedPlaylist([]);setStagedPlaylistState([]); setPlaylistName("")}}>Close</button></div>
                    :submissionState?.at(-1) ==="success" && submissionState.length>1
                        ?<div>Playlist has been created successfully!<button onClick={()=>{ setSubmissionState(null); setStagedPlaylist([]);setStagedPlaylistState([]); setPlaylistName("")}}>Close</button></div>
                    :submissionState?.at(-1)==="pending"
                        ?<div>loading...</div>
                    :submissionState?.at(-1)==="fail" && submissionState.length>1
                        ?<div>Failure to submit playlist for creation!<button onClick={()=>{}}>Close</button></div>
                    :!submissionState && trackCards?.length>0?trackCards:<div>Select a Tracklist to begin creating.</div>}
            </div>
        </div>
    )


}

export default DraftPlaylistContainer