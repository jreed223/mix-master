import React from "react";
import { PlaylistItem, Track } from "../../server/types";
import { Checkbox } from "@mui/material";

export interface TrackCardProps{
    onSelectedTrack: (event: React.ChangeEvent<HTMLInputElement>,selectedItem: PlaylistItem) => void
    playlistItem : PlaylistItem;
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
    return(
        <div className="track-card" id={props.playlistItem.track.id} style={{display:"flex", textOverflow: "ellipsis"}}>
            <input key={`checkbox-${props.playlistItem.track.id}`} type="checkbox" onChange={(e)=>props.onSelectedTrack(e, props.playlistItem )}/>
            <label>{props.playlistItem.track.name} - {props.playlistItem.track.artists[0].name}</label>
            {/* <p>{props.playlistItem.track.name} by {props.playlistItem.track.artists[0].name}</p> */}
        </div>
    )

}

export default TrackCard