import React, { useEffect, useState } from "react"
import { PlaylistItem, Track } from '../../server/types';
import TrackCard from "./TrackCard"

interface DraftPlaylistContainerProps{
    selectedTracks: Track[]|null
    onSelectedItems:(selectedItems:Track[])=>void
}

const DraftPlaylistContainer:React.FC<DraftPlaylistContainerProps>=(props: DraftPlaylistContainerProps)=>{

    // const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]|null>(null)
    const[draftedPlaylist, setDraftedPlaylist] = useState<Track[]>(null)
    const [selectedTracks, setSelectedTracks] = useState<Track[]>([])
    const [trackCards, setTrackCards] = useState<React.JSX.Element[]|null>(null)




    // useEffect(()=>{
    //     if(selectedPlaylistItems.length>0){
    //         setSelectedPlaylistItems(selectedPlaylistItems.concat(props.selectedTracks))
    //     }else{
    //         setSelectedPlaylistItems(props.selectedTracks)
    //     }
    // }, [props.selectedTracks, selectedPlaylistItems])

    useEffect(()=>{
        // setSelectedPlaylistItems([])
        console.log(props.selectedTracks)
        setDraftedPlaylist(props.selectedTracks)
        const editSelectedItemList = (e: React.ChangeEvent<HTMLInputElement>,selectedItem: Track)=>{
            if(e.target.checked){
                setSelectedTracks(selectedTracks.concat([selectedItem]))
        
            }else{
                setSelectedTracks(selectedTracks.filter(item=>item!== selectedItem))
            }
            console.log(selectedTracks)
        }

        if(draftedPlaylist&& draftedPlaylist.length>0){

            const tracks = draftedPlaylist.map(singleTrack=>
                <TrackCard track={singleTrack} onSelectedTrack={editSelectedItemList} displayHidden={false} checked={null}></TrackCard>
            )
            setTrackCards(tracks)
    
        }else{
            setTrackCards([])
        }
    }, [draftedPlaylist, props.selectedTracks, selectedTracks])


    if(trackCards &&trackCards.length>0){
return(                            
<div className="playlist-draft-container new-playlist" id="drafting-div">
    <button onClick={()=>{props.onSelectedItems(selectedTracks); setSelectedTracks([])}}>Remove Items</button>
    {trackCards}
    </div>
)
    }else{
        return(
        <div className="playlist-draft-container new-playlist" id="drafting-div"></div>
    )
    }
}

export default DraftPlaylistContainer