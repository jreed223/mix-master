import React, { useContext } from "react";
import TrackCollection from "../../../models/TrackCollection.ts";
import { ViewName } from "../../NavBar.tsx";
import { ViewContext, ViewContextType } from "../../../state_management/ViewProvider.tsx";
import { DraftingContext } from "../../../state_management/DraftingPaneProvider.tsx";


export interface LibraryItemCardProps {
    libraryItem: TrackCollection;
    ownerId: string;
    view: ViewName
}

const LibraryItemCard: React.FC<LibraryItemCardProps> = (props: LibraryItemCardProps) => {
    const { isMobile, user } = useContext<ViewContextType>(ViewContext)
    const { displayTracks, selectedLibraryItem } = useContext(DraftingContext)




    return (
        <div style={{ minWidth: isMobile ? "calc(50vw - 100px)" : "25vh", maxWidth: isMobile ? "calc(50vw - 80px)" : "25vw" }} className={"user-playlist-card"}>
            {/* <div style={selectedLibraryItem?.id === props.libraryItem.id?{}:{}} className={selectedLibraryItem?.id===props.libraryItem.id?"selected-playlist-img-container":"user-playlist-img-container"}> */}
            <img className="user-playlist-img" src={props.libraryItem.image.url} alt="playlist cover" onClick={() => { displayTracks(props.libraryItem); }}></img>

            {/* </div> */}
            <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
                <div className={"user-playlist-details-container"} style={{}} >
                    <p className="playlist-name playlist-card-text">{props.libraryItem.name !== "" ? props.libraryItem.name : "Untitled"}</p>
                    {props.libraryItem.type === "album" ?
                        <p className="playlist-card-text">{props.libraryItem.artists[0].name}</p> : props.libraryItem.type === "playlist" ?
                            <p className="playlist-card-text">{props.libraryItem.owner.display_name}</p> : <></>}
                    <div style={{ display: "flex", flexFlow: "row wrap", height: "100%", flex: 1 }}>

                        <p className="playlist-card-text" style={{ flex: "1", minWidth: "50%" }}>{props.libraryItem.totalTracks}  tracks</p>

                        <a href={`${props.libraryItem.uri}`} target="_blank" rel="noreferrer" className="spotify-button" style={{ alignItems: "center", justifyContent: "end", transition: ".75s" }}>
                            <div style={{ cursor: 'pointer', maxHeight: "35px", width: "100%", display: "flex", alignItems: "center", justifyContent: "end", flex: 1, opacity: selectedLibraryItem?.id === props.libraryItem.id ? "1" : "0", transition: '1s' }} >
                                <img src="/spotify/Primary_Logo_Green_RGB.svg" style={{ maxWidth: "35px" }} alt="spotify logo" />
                                <p style={{ whiteSpace: "nowrap", fontSize: "1em", overflow: "hidden", margin: " 0 0 0 2px", transition: '1s' }}>Open Spotify</p>
                            </div>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    )
}
// else{
//     return(
//         <div style={{minWidth: isMobile?"calc(50vw - 77px)":"25vh"}} className={"user-playlist-card"}>
//                 <div className={selectedLibraryItem?.id===props.libraryItem.id?"selected-playlist-img-container":"user-playlist-img-container"}>
//             <img  className="user-playlist-img" src={props.libraryItem.image.url} alt = "playlist cover"  ></img>
//             <div className={"user-playlist-details-container"} style={{cursor: "pointer", background:selectedLibraryItem?.id === props.libraryItem.id?"rgb(20 20 20 / 91%)":" linear-gradient(-15deg, rgb(17, 10, 2), rgba(17, 10, 2, 0.392), rgba(17, 10, 2, 0))"}} onClick={()=>{displayTracks(props.libraryItem);}}>
//                     <p className="playlist-name playlist-card-text">{props.libraryItem.name!==""?props.libraryItem.name:"Untitled"}</p>
//                     {props.libraryItem.type ==="album" ? 
//                         <p className = "playlist-card-text">{props.libraryItem.artists[0].name}</p>: props.libraryItem.type ==="playlist"? 
//                             <p className = "playlist-card-text">{props.libraryItem.owner.display_name}</p> :  <></>}
//                     <p className = "playlist-card-text">{props.libraryItem.totalTracks} tracks</p>
//                 </div>
//             </div>
//         </div>
//     )



// }

export default LibraryItemCard