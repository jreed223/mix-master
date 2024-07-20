import React, { useEffect, useState } from "react"
import { PlaylistItem } from "../../server/types"
import TrackCard from "./TrackCard"
import PlaylistClass from "../models/playlistClass"
interface SelectedPlaylistContainerProps{
    playlist: PlaylistClass|null
}

const SelectedPlaylistContainer:React.FC<SelectedPlaylistContainerProps>=(props: SelectedPlaylistContainerProps)=>{

const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistClass|null>(null)
const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]|null>(null)



useEffect(()=>{
    console.log(selectedPlaylist)
    setSelectedPlaylist(props.playlist)
    if(selectedPlaylist&&selectedPlaylist.tracks.length > 0){
        setPlaylistItems(selectedPlaylist.tracks)
        console.log("playlist Items set in staging area: ", selectedPlaylist.tracks )

    }
}, [props.playlist, selectedPlaylist])





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