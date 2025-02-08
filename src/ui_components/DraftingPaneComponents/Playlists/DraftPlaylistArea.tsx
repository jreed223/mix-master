import React, { useCallback, useContext, useEffect, useState } from "react"
import TrackCard from "../TrackComponents/TrackCard.tsx";
import TrackClass from "../../../models/TrackClass.ts";
import { ViewContext } from "../../../state_management/ViewProvider.tsx";
import { DraftingContext } from "../../../state_management/DraftingPaneProvider.tsx";
import type { Playlist } from '../../../../server/types.d.ts';
import TrackCollection from "../../../models/TrackCollection.ts";
import { parse, stringify } from "flatted";

interface DraftPlaylistContainerProps {
    setReloadKey: React.Dispatch<React.SetStateAction<number>>
    setDialogText: React.Dispatch<React.SetStateAction<submissionStatusState>>
    selectedTracks: TrackClass[]
    setSelectedTracks: React.Dispatch<React.SetStateAction<TrackClass[]>>
}
export type submissionStatusState = {status:"Pending"|"Success"|"Failed", text: string}


const DraftPlaylistContainer: React.FC<DraftPlaylistContainerProps> = ({ setReloadKey, setDialogText, selectedTracks, setSelectedTracks }: DraftPlaylistContainerProps) => {


    // const [selectedDraftTracks, setSelectedDraftTracks] = useState<TrackClass[]>([])
    const [trackCards, setTrackCards] = useState<React.JSX.Element[] | null>(null)
    const [stagedHistory] = useState<TrackClass[][]>([[]])
    const [undoRedoController, setUndoRedoController] = useState<number>(null)    // const [selectAllState, setSelectAllState] =useState<boolean[]>([])
    // const [playlistName, setPlaylistName] = useState<string>(null)
    // const [submissionState, setSubmissionState] = useState<submissionStatusState>(null)

    // const [newPlaylistId, setNewplaylistId] = useState(null)
    // const [displayWarning, setDisplayWarning] = useState(false)
    // const [displaySubmsnProgress, setDisplaySubmsnProgress] = useState(false)
    // const [displaySubmissionStatus, setDisplaySubmissionStatus] = useState(false)

    // const { stagingState } = useContext(ViewContext)
    const { user, isMaxDraftView, isMobile,} = useContext(ViewContext)
        // const {selectedFeatures} = useContext(TracklistContext)
        const {selectedLibraryItem, stagedPlaylist, setStagedPlaylist, stagingState, stagedPlaylistState,
            setStagedPlaylistState,
             displayFilterMenu,
            playlistName, setPlaylistName,
            submissionState, setSubmissionState, displayWarning, displaySubmsnProgress, setDisplaySubmsnProgress, draftingView, setDraftingView  } = useContext(DraftingContext)

    const deselectTrack = useCallback((trackId: string) => {
        setSelectedTracks(prev => prev.filter(selectedTrack => selectedTrack.track.id !== trackId))
    }, [setSelectedTracks])

    const removeStagedItems = useCallback((items: TrackClass[]) => {
        const newStagedPlaylist = stagedPlaylist.filter(stagedItem => !items.some(removedItem => removedItem.track.id === stagedItem.track.id))
        setStagedPlaylist(newStagedPlaylist)
        setStagedPlaylistState(stagedPlaylistState.concat([newStagedPlaylist]))
        console.log("Removed items: ", items)
        console.log("new Staged Playlist: ", newStagedPlaylist)
        console.log(stagedPlaylistState)

    }, [setStagedPlaylist, setStagedPlaylistState, stagedPlaylist, stagedPlaylistState])

    const cachedDraftPlaylist = localStorage.getItem("stagedPlaylist")

    if(cachedDraftPlaylist){
        const parsed : TrackClass[] = parse(cachedDraftPlaylist)
        const draftPlaylist = parsed.map(track=>new TrackClass(track.track, track.collection))
        setStagedPlaylist(draftPlaylist)
    }
    

    useEffect(() => {
        // console.log(stagedPlaylist)
        // console.log(stagedPlaylist)

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
    }, [deselectTrack, removeStagedItems, stagedPlaylist, selectedTracks, setSelectedTracks])




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


// useEffect(()=>{
//     if(((newPlaylistId===selectedLibraryItem?.id)&&submissionState?.status==="Success")||(stagingState==="closed" && submissionState?.status==="Success")){
//         setStagedPlaylist([])
//         setStagedPlaylistState([])
//         setPlaylistName("")
//         setSubmissionState(null)
//         setDisplaySubmsnProgress(false)
//     }
// },[newPlaylistId, selectedLibraryItem?.id, setStagedPlaylist, setStagedPlaylistState, stagingState, submissionState])

useEffect(()=>{
    if(submissionState?.status==="Pending"){
        setDisplaySubmsnProgress(true)
    }
},[setDisplaySubmsnProgress, submissionState?.status])


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


    useEffect(() => {
        if(stagedPlaylist&&stagedPlaylist.length>0){
            sessionStorage.setItem("stagedPlaylist", stringify(stagedPlaylist))
        }else{
            sessionStorage.removeItem("stagedPlaylist")
        }
    },[stagedPlaylist])




    return (
        <div className="playlist-draft-container new-playlist" style={stagingState === "open" ? { flex: draftingView==='selected playlist'?0:isMaxDraftView?"1":displayFilterMenu?"0 1 0px":"1 1 0px"  , transition: "1s", display: "flex", flexDirection: 'column' } : { flex: displayFilterMenu?"0 1 0px":isMaxDraftView?"1":"1 1 0px" , transition: "1s", display: "flex", flexDirection: 'column' }} id="drafting-div">
            
                <div style={{width:(isMobile?"100vw":isMaxDraftView&&displayFilterMenu?draftingView==='draft playlist'?"calc(100vw - 1px)":"calc(33.3vw - 1px)":isMaxDraftView?draftingView==="draft playlist"?'calc(100vw - 1px)':"calc(50vw - 1px)":draftingView==='draft playlist'?'calc(50vw - 1px)':"calc(25vw - 1px)"), transition:"1s",display:"flex", flexDirection:"column", height: '100%', overflowY:'hidden'}}>
                    {
                        <div style={{
                            position: "sticky",
                            top: 0,
                            backgroundColor: "#141414",
                             display:"flex",
                            flexDirection:"column"
                        }}>
                    
                            <div className="playlist-buttons-container" style={isMobile?{ flex: "1", width: '100%', whiteSpace: 'nowrap', display:"flex", flexFlow:"row wrap", alignItems:"center", justifyContent:"center"}:{ flex: "1", display:"flex", flexFlow:'wrap', alignItems:"center", justifyContent:"center"}}>
                            <dialog style={{width: "25vh", margin: "auto", backgroundColor: "#141414", color:"#757575"}} open={displayWarning}>Name your playlist before submitting!</dialog>
                            <div style={{ whiteSpace: 'nowrap', display:"inline-flex", flexFlow:"row wrap", alignItems:"center", justifyContent:"center", width: "calc(100% - 45px)"}}>
                                <img src="select-all-icon-grey.png" height="25px" style={{margin:"auto 10px", cursor:"pointer", transform:"translateX(22.5px)"}} alt="select all" onClick={()=>selectAllClicked()}></img>
                                <img src="deselect-all-icon-grey.png" height="25px" style={{margin:"auto 10px", cursor:"pointer", transform:"translateX(22.5px)"}} alt="select all" onClick={()=>deselectAllClicked()}></img>
                                    {/* {!isMobile?<button style={{margin:"auto 10px",  borderRadius:'15px'}} onClick={() => { deselectAllClicked() }}>Deselect All</button>:<></>}
                                    <button style={{margin:"auto 10px",  borderRadius:'15px'}} onClick={() => { selectAllClicked() }}>Select All</button> */}
                                    <button style={{margin:"5px 10px",  borderRadius:'15px', whiteSpace:"nowrap", transform:"translateX(22.5px)"}} onClick={() => { removeStagedItems(selectedTracks); setSelectedTracks([]) }}>Remove Items</button>
                           
                                    {stagedPlaylistState.length > 0 &&!submissionState ?
                                <>
                                    {undoRedoController !== 1 && stagedHistory.length > 1 ? <button style={{margin:"5px 10px",  borderRadius:'15px', whiteSpace:"nowrap", transform:"translateX(22.5px)"}} onClick={()=>{undoClicked()}}>Undo</button> : <></>}
                                    {undoRedoController ? <button style={{margin:"5px 10px", borderRadius:'15px', whiteSpace:"nowrap", transform:"translateX(22.5px)"}} onClick={() => { redoClicked() }}>Redo</button> : <></>}
                                </>
                                : <></>}
                            </div>

                            
                            <img src="expand.png" height="25px" style={{display:draftingView!=='draft playlist'?"unset":"none",margin:"auto 10px", cursor:"pointer"}} alt="select all" onClick={()=>{setDraftingView('draft playlist')}}></img>
                            <img src="minimize.png" height="25px" style={{display:draftingView==='draft playlist'?"unset":"none", margin:"auto 10px", cursor:"pointer"}} alt="select all" onClick={()=>{setDraftingView(null)}}></img>

                                    {/* {stagedPlaylist.length>0 &&!submissionState
                                    ?<button style={{margin:"auto 10px", borderRadius:'15px'}} onClick={()=>{}}>Submit Playlist</button>
                                    :<></>} */}
                                </div>
                            <input placeholder="Playlist Draft..." type="text" onChange={(e)=>setPlaylistName(e.target.value)} value={playlistName} style={{color:"#757575", textOverflow: "ellipsis", margin:"4px 15px", fontSize:"1.25em", fontWeight:"bold", border:"none", padding: "0 auto", backgroundColor: "#141414", textAlign:'center', minWidth:"50%", alignSelf:"center", width:"calc(100% - 30px)",}}></input>
                        </div>
                    }
                    <div style={{flex: 1, overflowY: "auto", overflowX: "clip"}}>
                    {displaySubmsnProgress && submissionState?
                    <div style={{display: "flex"}}>
                        <div>
                            <h4>{submissionState.status}</h4>
                            <p>{submissionState.text}</p>
                            <div>
                            <button onClick={submissionState.status==="Success"?()=>{setDisplaySubmsnProgress(false); setSubmissionState(null); setStagedPlaylist([]);setStagedPlaylistState([]); setPlaylistName("");}:()=>{setDisplaySubmsnProgress(false); setSubmissionState(null);}}>Close</button>
                            </div>
                        </div>
                        {submissionState.status==="Pending"?<div style={{margin: "auto"}}>Loading...</div>:<></>}
                    </div>
                    :trackCards?.length>0
                        ?trackCards
                        :<div style={{display: "flex", justifyItems: "center", alignItems: "center", margin:"33% 5px auto 5px", textAlign:'center' }}>
                            <p style={{margin: "auto", fontSize: "24px"}}>{selectedLibraryItem?"Add a track to get started.":"Search for tracks or select a library item to begin creating."}</p></div>}
                    </div>
                </div>
        </div>
    )


}

export default DraftPlaylistContainer