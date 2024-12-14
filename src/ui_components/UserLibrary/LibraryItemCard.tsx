import React, { useContext } from "react";
import TrackCollection from "../../models/libraryItems";
import { ViewName } from "../NavBar";
import { NavigationContext, NavigationContextType } from "../../state_management/NavigationProvider";
import { DraftingContext } from "../../state_management/DraftingPaneProvider";


export interface LibraryItemCardProps{
    libraryItem: TrackCollection;
    ownerId: string;
    view: ViewName
}

const LibraryItemCard: React.FC<LibraryItemCardProps> = (props: LibraryItemCardProps)=>{
    const {selectedLibraryItem, isMobile, user} = useContext<NavigationContextType>(NavigationContext)
    const { displayTracks} = useContext(DraftingContext)




    if(props.libraryItem.owner.id===user.id){
        return(
            <div style={{minWidth: isMobile?"calc(50vw - 75px)":"25vh"}}className={"user-playlist-card"}>
                    <div style={selectedLibraryItem?.id === props.libraryItem.id?{}:{}} className={selectedLibraryItem?.id===props.libraryItem.id?"selected-playlist-img-container":"user-playlist-img-container"}>
                <img className="user-playlist-img" src={props.libraryItem.image.url} alt = "playlist cover"  ></img>
                <div className={"user-playlist-details-container"} style={{background:selectedLibraryItem?.id === props.libraryItem.id?"rgb(20 20 20 / 91%)":" linear-gradient(-15deg, rgb(17, 10, 2), rgba(17, 10, 2, 0.392), rgba(17, 10, 2, 0))"}} onClick={()=>{displayTracks(props.libraryItem);}}>
                        <p className="playlist-name playlist-card-text">{props.libraryItem.name!==""?props.libraryItem.name:"Untitled"}</p>
                        <p className = "playlist-card-text">{props.libraryItem.totalTracks} tracks</p>
                    </div>
                </div>
            </div>
        )
    }else{
        return(
            <div style={{minWidth: isMobile?"calc(50vw - 75px)":"20vh"}} className={"user-playlist-card"}>
                    <div className={selectedLibraryItem?.id===props.libraryItem.id?"selected-playlist-img-container":"user-playlist-img-container"}>
                <img  className="user-playlist-img" src={props.libraryItem.image.url} alt = "playlist cover"  ></img>
                <div className={"user-playlist-details-container"} style={{background:selectedLibraryItem?.id === props.libraryItem.id?"rgb(20 20 20 / 91%)":" linear-gradient(-15deg, rgb(17, 10, 2), rgba(17, 10, 2, 0.392), rgba(17, 10, 2, 0))"}} onClick={()=>{displayTracks(props.libraryItem);}}>
                        <p className="playlist-name playlist-card-text">{props.libraryItem.name!==""?props.libraryItem.name:"Untitled"}</p>
                        {props.libraryItem.type ==="album" ? 
                            <p className = "playlist-card-text">{props.libraryItem.artists[0].name}</p>: props.libraryItem.type ==="playlist"? 
                                <p className = "playlist-card-text">{props.libraryItem.owner.display_name}</p> :  
                                    <p className = "playlist-card-text">unknown type</p>}
                        <p className = "playlist-card-text">{props.libraryItem.totalTracks} tracks</p>
                    </div>
                </div>
            </div>
        )
    
    }
    
    
}

export default LibraryItemCard