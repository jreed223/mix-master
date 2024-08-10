import React, { useEffect, useState } from "react"
import { Features, PlaylistItem, Track } from "../../server/types"
import TrackCard from "./TrackCard"
import PlaylistClass from "../models/playlistClass"
import Library from "../models/libraryItems"
interface SelectedPlaylistContainerProps{
    libraryItem: Library|null
    stagedPlaylistItems: Track[]|null
    onSelectedItems: (selectedItems: Track[]) => void
    filteredTracks: Track[]

}

const SelectedPlaylistContainer:React.FC<SelectedPlaylistContainerProps>=(props: SelectedPlaylistContainerProps)=>{


const [selectedLibraryItems, setSelectedLibraryItems] = useState<Track[]>([])


const editSelectedItemList = (e: React.ChangeEvent<HTMLInputElement>,selectedItem: Track)=>{
    if(e.target.checked){
        setSelectedLibraryItems(selectedLibraryItems.concat([selectedItem]))

    }else{
        setSelectedLibraryItems(selectedLibraryItems.filter(item=>item!== selectedItem))
    }
    // console.log(selectedPlaylistItems)
}


const stageSelectedDisplayedTracks = () =>{
    if(props.filteredTracks.length>0){
    const selectedDisplayed = (selectedLibraryItems.filter(selectedItem=>props.filteredTracks.some(filteredItem=>selectedItem.id === filteredItem.id)))
    // console.log("selected displayed tracks: ", selectedDisplayed)
    props.onSelectedItems(selectedDisplayed);
    const selectedHidden = (selectedLibraryItems.filter(selectedItem=>!props.filteredTracks.some(filteredItem=>selectedItem.id === filteredItem.id)))
    // console.log("selected hidden tracks: ", selectedHidden)
    setSelectedLibraryItems(selectedHidden)
    }else{
    props.onSelectedItems(selectedLibraryItems);
    setSelectedLibraryItems([])
    }
    
}


// console.log("tracks:", props.playlist?.tracks )
    if(props.libraryItem?.tracks){
        // console.log(props.audioFeatureFilters)
        // console.log("props playlist tracks: ",props.playlist.tracks[134])
        const unStagedItems = props.libraryItem.tracks.filter(unStagedItem=>!props.stagedPlaylistItems.some(stagedItem => stagedItem.id === unStagedItem.id))
        console.log("display block 2")
        return(
            <div className="search-filter-container new-playlist" id="search-filter-div" >
                <button onClick={()=>{stageSelectedDisplayedTracks();}}>Add Items</button>
                {props.filteredTracks?
                    // hasAudioFeatures?
                        props.libraryItem.tracks.map(singleTrack=>{
                            
                            const staged = !unStagedItems.includes(singleTrack)
                            const filtered = !props.filteredTracks.some(filteredTrack => filteredTrack.id === singleTrack.id)
                            //const stagedOrFiltered = staged||filtered
                            if(staged){
                                console.log("stagedItem rendered")
                                return(
                                    <TrackCard track={singleTrack} onSelectedTrack={editSelectedItemList} displayHidden={true} checked={false}></TrackCard>
                                    )
                            }else{
                                console.log("unstaged Item rendered")
                                // console.log(`single track: ${JSON.stringify(singleTrack)} in filtered Track? ${filteredTracks.includes(singleTrack)}`)
                                return(
                                    <TrackCard track={singleTrack} onSelectedTrack={editSelectedItemList} displayHidden={filtered} checked={null}></TrackCard>
                                    )
                            }
                            
                    }):
                        (
                        <p>Filtering Tracks...</p>
                        )
                    //     :
                    // props.playlist.tracks.map(singleTrack=>{
                    //     const staged = !unStagedItems.includes(singleTrack)
                    //         if(staged){
                    //             console.log("staged no audio feature item")
                    //             return(
                    //                 <TrackCard playlistItem={singleTrack} onSelectedTrack={editSelectedItemList} displayHidden={unStagedItems.includes(singleTrack)?false:true} checked={false}></TrackCard>
                    //                 )
                    //         }else{
                    //             console.log("unstaged no audio feature item")

                    //             return(
                                    
                    //                 <TrackCard playlistItem={singleTrack} onSelectedTrack={editSelectedItemList} displayHidden={unStagedItems.includes(singleTrack)?false:true} checked={null}></TrackCard>
                    //                 )
                    //         }


                    //     }
                    //         )
                }
                
            </div>
        )
    }else {
        console.log("display block 3")
        return(
        <div className="search-filter-container new-playlist" id="search-filter-div" >
            <p>Loading Tracks...</p>
        </div>
        )
    }
}

export default SelectedPlaylistContainer