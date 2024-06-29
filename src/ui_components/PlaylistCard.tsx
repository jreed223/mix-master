import React from "react";
import { fetchPlaylistsItems } from "../getData/playlist_items";
import { getData } from "../authentication/AuthHandler";

interface PlaylistCardProps{
    playlist : Playlist;
}

async function getTracks(playlistObject:Playlist){
    await fetch("/spotify-data/playlist-items", {
        method: "GET",
        headers: {"id" : `${playlistObject.id}` }
    })}

export default function PlaylistCard({playlist}: PlaylistCardProps){
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

