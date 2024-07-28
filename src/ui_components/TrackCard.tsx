import React, { useRef } from "react";
import { PlaylistItem, Track } from "../../server/types";
import { Checkbox } from "@mui/material";

export interface TrackCardProps{
    onSelectedTrack: (event: React.ChangeEvent<HTMLInputElement>,selectedItem: PlaylistItem) => void
    playlistItem : PlaylistItem;
    displayHidden : boolean;
    checked: boolean|null;
}

const TrackCard: React.FC<TrackCardProps> = (props: TrackCardProps)=>{

    // let playlistClass = new PlaylistClass(props.playlist.id, props.playlist.images[0], props.playlist.name,props.playlist.owner, props.playlist.snapshot_id, props.playlist.uri, props.playlist.tracks.total)

    // const onPlaylistSelection =  (event) => {
    //     event.preventDefault(); // Prevent default behavior if needed
    //     playlistClass.setTracks().then(()=>{
    //     props.onSelectedPlaylist(playlistClass)
    //     })
    // };

    // console.log(playlist);
        
    const displayStyle = props.displayHidden?
        {display: 'none',
        textOverflow: 'ellipsis'}:
            {display: 'flex',
            textOverflow: 'ellipsis'}
    
    if(props.displayHidden){

    }
    // console.log("checkbox checked? ", props.checked)
    return(
        <div className="track-card" id={props.playlistItem.track.id} style={displayStyle}>
            {props.checked === true?
                (<input checked={props.checked} key={`checkbox-${props.playlistItem.track.id}`} type="checkbox" onChange={(e)=>props.onSelectedTrack(e, props.playlistItem )}/>
            ):props.checked === false?
                (<input checked={props.checked} key={`checkbox-${props.playlistItem.track.id}`} type="checkbox" onChange={(e)=>props.onSelectedTrack(e, props.playlistItem )}/>
            ):
                (<input key={`checkbox-${props.playlistItem.track.id}`} type="checkbox" onChange={(e)=>props.onSelectedTrack(e, props.playlistItem )}/>)
            }
            <label>{props.playlistItem.track.name} - {props.playlistItem.track.artists[0].name}</label>
        </div>
    )

}

export default TrackCard