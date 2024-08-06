import React from "react";
import { Album } from "../../server/types";

export interface AlbumCardProps{
    onSelectedAlbum: (album: Album) => void
    album: Album;
}

const PlaylistCard: React.FC<AlbumCardProps> = (props: AlbumCardProps)=>{

    // const [playlistObject, setPlaylistObject] = useState<PlaylistClass|null>(props.playlist)

    
    return(
        <div className="playlist-card">
            <span>
            <img className="playlist-img" src={props.album.album.images[0].url} alt = "playlist cover" onClick={()=>props.onSelectedAlbum(props.album)} ></img>
                <div>
                    <p className="playlist-name playlist-card-text">{props.album.album.name!==""?props.album.album.name:"Untitled"}</p>
                    <p className = "playlist-card-text">{props.album.album.artists[0].name}</p>
                    <p className = "playlist-card-text">{props.album.album.total_tracks} tracks</p>
                </div>

            </span>
        </div>
    )

}

export default PlaylistCard