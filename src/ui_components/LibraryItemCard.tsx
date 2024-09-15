import React from "react";
import { Album } from "../../server/types";
import Library from "../models/libraryItems";

export interface LibraryItemCardProps{
    onSelectedAlbum: (album: Library) => void
    libraryItem: Library;
}

const LibraryItemCard: React.FC<LibraryItemCardProps> = (props: LibraryItemCardProps)=>{

    // const [playlistObject, setPlaylistObject] = useState<PlaylistClass|null>(props.playlist)

    
    return(
        <div className="playlist-card">
            <span>
            <img className="playlist-img" src={props.libraryItem.image.url} alt = "playlist cover" onClick={()=>props.onSelectedAlbum(props.libraryItem)} ></img>
                <div>
                    <p className="playlist-name playlist-card-text">{props.libraryItem.name!==""?props.libraryItem.name:"Untitled"}</p>
                    {props.libraryItem.type ==="album" ? 
                        <p className = "playlist-card-text">{props.libraryItem.artists[0].name}</p>: props.libraryItem.type ==="playlist"? 
                            <p className = "playlist-card-text">{props.libraryItem.owner.display_name}</p> :  
                                <p className = "playlist-card-text">unknown type</p>}
                    <p className = "playlist-card-text">{props.libraryItem.totalTracks} tracks</p>
                </div>

            </span>
        </div>
    )

}

export default LibraryItemCard