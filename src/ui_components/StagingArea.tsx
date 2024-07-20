import React, { useEffect, useState } from "react"
import { PlaylistItem } from "../../server/types"
import TrackCard from "./TrackCard"

interface DraftPlaylistContainerProps{
    selectedTracks: PlaylistItem[]|null
}

const DraftPlaylistContainer:React.FC<DraftPlaylistContainerProps>=(props: DraftPlaylistContainerProps)=>{

    const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]|null>(null)
    const [fullSelectedTracklist, setFullSelectedTracklist] = useState<PlaylistItem[]>([])

    useEffect(()=>{
        setPlaylistItems(props.selectedTracks)
        if(playlistItems&&playlistItems.length>0){
            setFullSelectedTracklist(fullSelectedTracklist.concat(playlistItems))
        }
    }, [props.selectedTracks, playlistItems, fullSelectedTracklist])

    if(fullSelectedTracklist.length>0){

        const tracks = fullSelectedTracklist.map(singleTrack=>
            <TrackCard playlistItem={singleTrack}></TrackCard>
        )

    }
return(                            
<div className="playlist-draft-container new-playlist" id="drafting-div"></div>
)

}