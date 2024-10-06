import React, { useCallback, useEffect, useRef, useState } from "react"
import { PlaylistItem, Track } from '../../server/types';
import TrackCard from "./TrackCard"

interface DraftPlaylistContainerProps{
    stagedTracks: Track[]|null
    onSelectedItems:(selectedItems:Track[])=>void
    onUndostaging: React.Dispatch<React.SetStateAction<Track[]>>
    stagedItemsState: Track[][]
}

const DraftPlaylistContainer:React.FC<DraftPlaylistContainerProps>=(props: DraftPlaylistContainerProps)=>{

    // const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]|null>(null)
    // const [displayedTracks, setDisplayedTracks] = useState<Track[]>(null)
    const [selectedTracks, setSelectedTracks] = useState<Track[]>([])
    const [trackCards, setTrackCards] = useState<React.JSX.Element[]|null>(null)
    const [stagedHistory, setStagedHistory] = useState<Track[][]>([[]])
    const [undoHistory, setUndoStagedHistory] = useState<Track[][]>(null)
    const [undoRedoController, setUndoRedoController] = useState<number>(null)    // const [selectAllState, setSelectAllState] =useState<boolean[]>([])
    // const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false)






    useEffect(()=>{
        console.log(props.stagedTracks)
        // setSelectedPlaylistItems([])
        console.log(props.stagedTracks)

        const editSelectedItemList2 = (checked: boolean,selectedItem: Track)=>{
            if(checked){
                setSelectedTracks(selectedTracks.concat([selectedItem]))
        
            }else{
                // setSelectAllChecked(false)
                setSelectedTracks(selectedTracks.filter(item=>item!== selectedItem))
            }
            console.log(selectedTracks)
        }


        if(props.stagedTracks&& props.stagedTracks.length>0){

            const tracks = props.stagedTracks.map(singleTrack=>
                <TrackCard key={`drafted-playlist-${singleTrack.id}`}  track={singleTrack} onSelectedTrack={editSelectedItemList2} displayHidden={false} selectedLibraryItems={selectedTracks}></TrackCard>
            )
            setTrackCards(tracks)
    
        }else{
            setTrackCards([])
        }
    }, [props.stagedTracks, selectedTracks])


    useEffect(()=>{


          function areListsEqual(list1: Track[], list2: Track[]): boolean {
            if (list1.length !== list2.length) return false;
            return list1.every((obj, index)=>obj.id === list2[index].id)
          
            //return list1.every((obj1, index) => areObjectsEqual(obj1, list2[index]));
          }
          const listsAreEqual1 = areListsEqual(props.stagedTracks, stagedHistory.at(-1))
          const listsAreEqual2 = areListsEqual(props.stagedTracks, stagedHistory.at(undoRedoController-1))
        //   let listsAreEqual3 = false

        //   undoRedoController < stagedHistory.length-1? listsAreEqual3 = areListsEqual(props.stagedTracks, stagedHistory.at(undoRedoController+1)):listsAreEqual3=false


          console.log(`stagedTracks: ${props.stagedTracks}, stagedHistory: ${stagedHistory.at(-1)}, equal?: ${listsAreEqual1}`)

        if(!undoRedoController && !listsAreEqual1){
            // setStagedHistory(stagedHistory.concat([props.stagedTracks]))
            stagedHistory.push(props.stagedTracks)
            // setStagedHistory()
        }
        else if(!listsAreEqual2 && undoRedoController>0){
            console.log("RANNN")
            stagedHistory.splice(undoRedoController)
            stagedHistory.push(props.stagedTracks)
            setUndoRedoController(null)
            // const newStagedprefix = stagedHistory.slice(0, undoRedoController)
            // stagedHistory = newStagedprefix.concat([props.stagedTracks])
            // setStagedHistory(newStagedprefix.concat([props.stagedTracks]))
        }
        // else if(undoRedoController===stagedHistory.length-1){
        //     setUndoRedoController(null)
        // }
        console.log(`stagedHistory length: ${stagedHistory.length}, undoController :${undoRedoController}`)

        console.log("stagedHistory state: ",stagedHistory)
    },[props.stagedTracks, stagedHistory, undoRedoController])





    const selectAllClicked = ()=>{
        setSelectedTracks(props.stagedTracks)

}

const deselectAllClicked = ()=>{
    setSelectedTracks([])
}

const undoClicked = ()=>{
    // console.log(stagedHistory)
    let stateIdx;
    if(undoRedoController){
        stateIdx = undoRedoController-1
        setUndoRedoController(prev=>prev-1 )
    }else{
        stateIdx = stagedHistory.length - 1
        setUndoRedoController(stateIdx)
    }
    // const currentState = undoRedoController 
    console.log("undoIdx: ",stateIdx)
    props.onUndostaging(stagedHistory.at(stateIdx-1))
}
const redoClicked = ()=>{
    setUndoRedoController(prev=>prev+1===stagedHistory.length?null:prev+1 )
    props.onUndostaging(stagedHistory.at(undoRedoController))


}





    // if(trackCards &&trackCards.length>0){
        // stagedHistory.push(props.stagedTracks)

return(
<div className="playlist-draft-container new-playlist" id="drafting-div">
    {
        <div style={{
                    position:"sticky",
                    top: 0,
                    backgroundColor: "#141414"
                }}>

            
                    {/* <input type="checkbox" readOnly checked={} onClick={()=>{toggleSelectAll()}}/><label>Check all</label> */}
                    <button onClick={()=>{deselectAllClicked()}}>Deselect All</button>
                    <button onClick={()=>{selectAllClicked()}}>Select All</button>
                    <button onClick={()=>{props.onSelectedItems(selectedTracks); setSelectedTracks([])}}>Remove Items</button>

                    {props.stagedItemsState.length>0?
                    <>
                    {undoRedoController!==1 && stagedHistory.length>1?<button onClick={()=>{undoClicked()}}>Undo</button>:<></>}
                    {undoRedoController?<button onClick={()=>{redoClicked()}}>Redo</button>:<></>}
                    </>
                    :<></>}

                </div>
                }
    
    {trackCards}
    </div>
)

    // }
}

export default DraftPlaylistContainer