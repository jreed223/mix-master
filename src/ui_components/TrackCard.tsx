import React from "react";
import { PlaylistItem, Track } from "../../server/types";

export interface TrackCardProps{
    //onSelectedTrack: (track: Track) => void
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
        <div className="track-card">
            <p>{props.playlistItem.track.name} by {props.playlistItem.track.artists[0].name}</p>
        </div>
    )

}

export default TrackCard