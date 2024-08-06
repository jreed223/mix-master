import React, { useEffect, useState } from "react"
import { Features, PlaylistItem } from "../../server/types"
import TrackCard from "./TrackCard"
import PlaylistClass from "../models/playlistClass"
interface SelectedPlaylistContainerProps{
    playlist: PlaylistClass|null
    stagedPlaylistItems: PlaylistItem[]|null
    onSelectedItems: (selectedItems: PlaylistItem[]) => void
    filteredTracks: PlaylistItem[]

}

const SelectedPlaylistContainer:React.FC<SelectedPlaylistContainerProps>=(props: SelectedPlaylistContainerProps)=>{


const [selectedPlaylistItems, setSelectedPlaylistItems] = useState<PlaylistItem[]>([])


const editSelectedItemList = (e: React.ChangeEvent<HTMLInputElement>,selectedItem: PlaylistItem)=>{
    if(e.target.checked){
        setSelectedPlaylistItems(selectedPlaylistItems.concat([selectedItem]))

    }else{
        setSelectedPlaylistItems(selectedPlaylistItems.filter(item=>item!== selectedItem))
    }
    // console.log(selectedPlaylistItems)
}


const stageSelectedDisplayedTracks = () =>{
    if(props.filteredTracks.length>0){
    const selectedDisplayed = (selectedPlaylistItems.filter(selectedItem=>props.filteredTracks.some(filteredItem=>selectedItem.track.id === filteredItem.track.id)))
    // console.log("selected displayed tracks: ", selectedDisplayed)
    props.onSelectedItems(selectedDisplayed);
    const selectedHidden = (selectedPlaylistItems.filter(selectedItem=>!props.filteredTracks.some(filteredItem=>selectedItem.track.id === filteredItem.track.id)))
    // console.log("selected hidden tracks: ", selectedHidden)
    setSelectedPlaylistItems(selectedHidden)
    }else{
    props.onSelectedItems(selectedPlaylistItems);
    setSelectedPlaylistItems([])
    }
    
}


// console.log("tracks:", props.playlist?.tracks )
    if(props.playlist?.tracks.length>0){
        // console.log(props.audioFeatureFilters)
        // console.log("props playlist tracks: ",props.playlist.tracks[134])
        const unStagedItems = props.playlist.tracks.filter(unStagedItem=>!props.stagedPlaylistItems.some(stagedItem => stagedItem.track.id === unStagedItem.track.id))
        console.log("display block 2")
        return(
            <div className="search-filter-container new-playlist" id="search-filter-div" >
                <button onClick={()=>{stageSelectedDisplayedTracks();}}>Add Items</button>
                {props.filteredTracks?
                    // hasAudioFeatures?
                        props.playlist.tracks.map(singleTrack=>{
                            
                            const staged = !unStagedItems.includes(singleTrack)
                            const filtered = !props.filteredTracks.some(filteredTrack => filteredTrack.track.id === singleTrack.track.id)
                            //const stagedOrFiltered = staged||filtered
                            if(staged){
                                console.log("stagedItem rendered")
                                return(
                                    <TrackCard playlistItem={singleTrack} onSelectedTrack={editSelectedItemList} displayHidden={true} checked={false}></TrackCard>
                                    )
                            }else{
                                console.log("unstaged Item rendered")
                                // console.log(`single track: ${JSON.stringify(singleTrack)} in filtered Track? ${filteredTracks.includes(singleTrack)}`)
                                return(
                                    <TrackCard playlistItem={singleTrack} onSelectedTrack={editSelectedItemList} displayHidden={filtered} checked={null}></TrackCard>
                                    )
                            }
                            
                    }):
                        (
                        <p>Filtering Tracks...</p>
                        )
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