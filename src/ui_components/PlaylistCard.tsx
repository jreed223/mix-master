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
                    <p className="playlist-name playlist-card-text">{playlist.name!==""?playlist.name:"Untititled"}</p>
                    <p className = "playlist-card-text">{playlist.owner.display_name}</p>
                    <p className = "playlist-card-text">{playlist.tracks.total} tracks</p>
                </div>

            </span>
        </div>
    )

}