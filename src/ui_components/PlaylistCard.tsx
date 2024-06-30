import React, { useState } from "react";
import { PlaylistItem } from '../../server/types';

// const [isLoading, setLoading] = useState(true);
// const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]|null>(null)

interface PlaylistCardProps{
    playlist : Playlist;
}

async function getTracks(playlistObject:Playlist){
    const playlistItems : PlaylistItem[] = await fetch("/spotify-data/playlist-items", {
        method: "GET",
        headers: {"id" : `${playlistObject.id}` }
    }).then(async (res)=>{
        const items = await res.json()
        return items
    })

    return playlistItems
   

}

async function getTracksAndFeatures(playlist:Playlist){
    const playlistItems = await getTracks(playlist)
    console.log(playlistItems)
    const itemsAndFeatures = await fetch("/spotify-data/audio-features", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(playlistItems)
    }).then(async (res)=>{
        const detailedItems = await res.json()
        return detailedItems
    })

    return itemsAndFeatures

}
export default function PlaylistCard({playlist}: PlaylistCardProps){
    // console.log(playlist);
    return(
        <div className="playlist-card">
            <span>
            <img className="playlist-img" src={playlist.images[0].url} alt = "playlist cover" onClick={()=>{getTracksAndFeatures(playlist)}} ></img>
                <div>
                    <p className="playlist-name playlist-card-text">{playlist.name!==""?playlist.name:"Untititled"}</p>
                    <p className = "playlist-card-text">{playlist.owner.display_name}</p>
                    <p className = "playlist-card-text">{playlist.tracks.total} tracks</p>
                </div>

            </span>
        </div>
    )

}

