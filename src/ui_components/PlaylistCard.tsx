import React from "react";
import { fetchPlaylistsItems } from "../getData/playlist_items";
import { getData } from "../authentication/AuthHandler";

interface PlaylistCardProps{
    playlist : Playlist;
}


export default function PlaylistCard({playlist}: PlaylistCardProps){
    const token = getData("access_token")
    // console.log(playlist);
    return(
        <div className="playlist-card">
            <span>
            <img className="playlist-img" src={playlist.images[0].url} alt = "playlist cover" onClick={()=>{getTracks(playlist)}} ></img>
                <div>
                    <p className="playlist-name playlist-card-text">{playlist.name!==""?playlist.name:"Untititled"}</p>
                    <p className = "playlist-card-text">{playlist.owner.display_name}</p>
                    <p className = "playlist-card-text">{playlist.tracks.total} tracks</p>
                </div>

            </span>
        </div>
    )

}

async function getTracks(playlistObject){
    await fetch("/spotify-api/playlist-items", {
        method: "POST",
        body: playlistObject
    })}