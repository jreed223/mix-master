import React, { useEffect, useState } from "react"
import { PlaylistItem } from '../../server/types';
import TrackCard from "./TrackCard"

interface DraftPlaylistContainerProps{
    selectedTracks: PlaylistItem[]|null
    onSelectedItems:(selectedItems:PlaylistItem[])=>void
}

const DraftPlaylistContainer:React.FC<DraftPlaylistContainerProps>=(props: DraftPlaylistContainerProps)=>{

    // const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]|null>(null)
    const[draftedPlaylist, setDraftedPlaylist] = useState<PlaylistItem[]>(null)
    const [selectedPlaylistItems, setSelectedPlaylistItems] = useState<PlaylistItem[]>([])
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
        const editSelectedItemList = (e: React.ChangeEvent<HTMLInputElement>,selectedItem: PlaylistItem)=>{
            if(e.target.checked){
                setSelectedPlaylistItems(selectedPlaylistItems.concat([selectedItem]))
        
            }else{
                setSelectedPlaylistItems(selectedPlaylistItems.filter(item=>item!== selectedItem))
            }
            console.log(selectedPlaylistItems)
        }

        if(draftedPlaylist&& draftedPlaylist.length>0){

            const tracks = draftedPlaylist.map(singleTrack=>
                <TrackCard playlistItem={singleTrack} onSelectedTrack={editSelectedItemList} displayHidden={false} checked={null}></TrackCard>
            )
            setTrackCards(tracks)
    
        }else{
            setTrackCards([])
        }
    }, [draftedPlaylist, props.selectedTracks, selectedPlaylistItems])


    if(trackCards &&trackCards.length>0){
return(                            
<div className="playlist-draft-container new-playlist" id="drafting-div">
    <button onClick={()=>{props.onSelectedItems(selectedPlaylistItems); setSelectedPlaylistItems([])}}>Remove Items</button>
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