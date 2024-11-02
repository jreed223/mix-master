import React from "react";
import TrackCollection from "../../models/libraryItems";


export interface LibraryItemCardProps{
    onSelectedAlbum: (album: TrackCollection, currentView: string) => void
    libraryItem: TrackCollection;
    ownerId: string;
    selectedLibraryItemId: string
    currentView: string
    setIsSearching: React.Dispatch<React.SetStateAction<boolean>>
}

const LibraryItemCard: React.FC<LibraryItemCardProps> = (props: LibraryItemCardProps)=>{

    // const [playlistObject, setPlaylistObject] = useState<PlaylistClass|null>(props.playlist)
    if(props.ownerId===props.libraryItem?.owner?.id){
        return(
            <div className={"user-playlist-card"}>
                {/* <span> */}
                    <div style={props.selectedLibraryItemId === props.libraryItem.id?{}:{}} className={props.selectedLibraryItemId===props.libraryItem.id?"selected-playlist-img-container":"user-playlist-img-container"}>
                <img loading="lazy" className="user-playlist-img" src={props.libraryItem.image.url} alt = "playlist cover"  ></img>
                <div className={"user-playlist-details-container"} style={{background:props.selectedLibraryItemId === props.libraryItem.id?"rgb(20 20 20 / 91%)":" linear-gradient(-15deg, rgb(17, 10, 2), rgba(17, 10, 2, 0.392), rgba(17, 10, 2, 0))"}} onClick={()=>{props.onSelectedAlbum(props.libraryItem, props.currentView); props.setIsSearching(false)}}>
                        <p className="playlist-name playlist-card-text">{props.libraryItem.name!==""?props.libraryItem.name:"Untitled"}</p>
                
                        {/* {props.libraryItem.type ==="album" ? 
                            <p className = "playlist-card-text">{props.libraryItem.artists[0].name}</p>: props.libraryItem.type ==="playlist" && ? 
                                <p className = "playlist-card-text">{props.libraryItem.owner.display_name}</p> :  
                                    <p className = "playlist-card-text">unknown type</p>} */}
                        <p className = "playlist-card-text">{props.libraryItem.totalTracks} tracks</p>
                    </div>
                </div>
                    
    
                {/* </span> */}
            </div>
        )
    }else{
        return(
            <div className={"playlist-card2"}>
                {/* <span> */}
                    <div className={props.selectedLibraryItemId===props.libraryItem.id?"selected-playlist-img-container":"playlist-img-container"}>
                <img loading="lazy" className="playlist-img" src={props.libraryItem.image.url} alt = "playlist cover"  ></img>
                <div className={"playlist-details-container"} style={{background:props.selectedLibraryItemId === props.libraryItem.id?"rgb(20 20 20 / 91%)":" linear-gradient(-15deg, rgb(17, 10, 2), rgba(17, 10, 2, 0.392), rgba(17, 10, 2, 0))"}} onClick={()=>{props.onSelectedAlbum(props.libraryItem, props.currentView); props.setIsSearching(false)}}>
                        <p className="playlist-name playlist-card-text">{props.libraryItem.name!==""?props.libraryItem.name:"Untitled"}</p>
                        {props.libraryItem.type ==="album" ? 
                            <p className = "playlist-card-text">{props.libraryItem.artists[0].name}</p>: props.libraryItem.type ==="playlist"? 
                                <p className = "playlist-card-text">{props.libraryItem.owner.display_name}</p> :  
                                    <p className = "playlist-card-text">unknown type</p>}
                        <p className = "playlist-card-text">{props.libraryItem.totalTracks} tracks</p>
                    </div>
                </div>
                    
    
                {/* </span> */}
            </div>
        )
    
    }
    
    
}

export default LibraryItemCard