import React, { useEffect, useState } from "react"
import { PlaylistItem } from "../../server/types"
import TrackCard from "./TrackCard"
import PlaylistClass from "../models/playlistClass"
interface SelectedPlaylistContainerProps{
    playlist: PlaylistClass|null
    stagedPlaylistItems: PlaylistItem[]|null
    onSelectedItems: (selectedItems: PlaylistItem[]) => void

}

const SelectedPlaylistContainer:React.FC<SelectedPlaylistContainerProps>=(props: SelectedPlaylistContainerProps)=>{

const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistClass|null>(null)
const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]|null>(null)
const [selectedPlaylistItems, setSelectedPlaylistItems] = useState<PlaylistItem[]>([])

const editSelectedItemList = (e: React.ChangeEvent<HTMLInputElement>,selectedItem: PlaylistItem)=>{
    if(e.target.checked){
        setSelectedPlaylistItems(selectedPlaylistItems.concat([selectedItem]))

    }else{
        setSelectedPlaylistItems(selectedPlaylistItems.filter(item=>item!== selectedItem))
    }
    console.log(selectedPlaylistItems)
}

useEffect(()=>{
    console.log(selectedPlaylist)
    setSelectedPlaylistItems([])
    setSelectedPlaylist(props.playlist)
    if(selectedPlaylist&&selectedPlaylist.tracks.length > 0){
        setPlaylistItems(selectedPlaylist.tracks)
        console.log("playlist Items set in staging area: ", selectedPlaylist.tracks )

    }
}, [props.playlist, selectedPlaylist])





    if(playlistItems){
        const unStagedItems = playlistItems.filter(unStagedItem=>!props.stagedPlaylistItems.some(stagedItem => stagedItem.track.id === unStagedItem.track.id))
  
        const tracks = unStagedItems.map(singleTrack=>
            <TrackCard playlistItem={singleTrack} onSelectedTrack={editSelectedItemList}></TrackCard>
        )
    
        return(
            <div className="search-filter-container new-playlist" id="search-filter-div" >
                <button onClick={()=>{props.onSelectedItems(selectedPlaylistItems); setSelectedPlaylistItems([])}}>Add Items</button>
                {tracks}
            </div>
        )
    }else{
        return(
        <div className="search-filter-container new-playlist" id="search-filter-div" >
        </div>
        )
    }
}

export default SelectedPlaylistContainer