import React, { useState } from "react"
import { PlaylistItem } from "../../server/types"
import TrackCard from "./TrackCard"
import PlaylistClass from "../models/playlistClass"
interface SelectedPlaylistContainerProps{
    playlist: PlaylistClass|null
}

const SelectedPlaylistContainer:React.FC<SelectedPlaylistContainerProps>=(props: SelectedPlaylistContainerProps)=>{

const [selectedPlaylistId, setSelectedPlaylistId] = useState<PlaylistClass["id"]|null>(null)
const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]|null>(null)

const displayTracks =()=> {
    // if(props.playlist.tracks){
    //     setPlaylistItems(props.playlist.tracks)
    // }else{
    if(props.playlist.tracks.length > 0){
        setPlaylistItems(props.playlist.tracks)
    }else{
        props.playlist.setTracks().then(()=>{
            setPlaylistItems(props.playlist.tracks)
        })
    }
     
        
        console.log("playlist Items set: ", playlistItems )
}

if(props.playlist&& (props.playlist.id!==selectedPlaylistId)){
    setSelectedPlaylistId(props.playlist.id)
    displayTracks()
}




    if(playlistItems){

        const tracks = playlistItems.map(singleTrack=>
            <TrackCard playlistItem={singleTrack}></TrackCard>
        )
    
        return(
            <div className="search-filter-container new-playlist" id="search-filter-div" >
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