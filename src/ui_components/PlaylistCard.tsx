import React from "react";

interface PlaylistCardProps{
    playlist : Playlist;
}
export default function PlaylistCard({playlist}: PlaylistCardProps){

    return(
        <div className="playlist-card">
            <span>
            <img className="playlist-img" src={playlist.images[0].url} alt = "playlist cover" ></img>
                <div>
                    <h3>{playlist.name}</h3>
                    <p>{playlist.owner.displayname}</p>
                    <p>{playlist.tracks.total} tracks</p>
                </div>

            </span>
        </div>
    )

}