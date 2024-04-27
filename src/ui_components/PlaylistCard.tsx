import React from "react";

interface PlaylistCardProps{
    playlist : Playlist;
}
export default function PlaylistCard({playlist}: PlaylistCardProps){
    // console.log(playlist);
    return(
        <div className="playlist-card">
            <span>
            <img className="playlist-img" src={playlist.images[0].url} alt = "playlist cover" ></img>
                <div>
                    <p className="playlist-name">{playlist.name!==""?playlist.name:"Untititled"}</p>
                    <p>{playlist.owner.display_name}</p>
                    <p>{playlist.tracks.total} tracks</p>
                </div>

            </span>
        </div>
    )

}