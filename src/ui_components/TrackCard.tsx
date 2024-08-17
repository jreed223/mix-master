import React, { memo, useRef } from "react";
import { PlaylistItem, Track } from "../../server/types";
import { Checkbox } from "@mui/material";
import Library from "../models/libraryItems";

export interface TrackCardProps{
    onSelectedTrack: (event: React.ChangeEvent<HTMLInputElement>,selectedItem: Track) => void
    track : Track;
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
        <div className="track-card" id={props.track.id} style={displayStyle}>
            {props.checked === true?
                (<input checked={props.checked} key={`checkbox-${props.track.id}`} type="checkbox" onChange={(e)=>props.onSelectedTrack(e, props.track )}/>
            ):props.checked === false?
                (<input checked={props.checked} key={`checkbox-${props.track.id}`} type="checkbox" onChange={(e)=>props.onSelectedTrack(e, props.track )}/>
            ):
                (<input key={`checkbox-${props.track.id}`} type="checkbox" onChange={(e)=>props.onSelectedTrack(e, props.track )}/>)
            }
            <label>{props.track.name} - {props.track.artists[0].name}</label>
        </div>
    )

}

export default memo(TrackCard)