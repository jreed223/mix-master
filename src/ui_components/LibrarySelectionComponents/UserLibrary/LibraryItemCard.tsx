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
    const { isMobile } = useContext<ViewContextType>(ViewContext)
    const { displayTracks, selectedLibraryItem, stagingState } = useContext(DraftingContext)




    return (
        <div style={{ minWidth: isMobile ? "calc(50vw - 100px)" : "25vh", maxWidth: isMobile ? "calc(50vw - 80px)" : "25vw" }} className={"user-playlist-card"}>
            <img className="user-playlist-img" src={props.libraryItem.image.url} style={{ cursor: (selectedLibraryItem?.id === props.libraryItem?.id)&& stagingState==="open" ? 'default' : 'pointer' }} alt="playlist cover" onClick={(selectedLibraryItem?.id === props.libraryItem?.id)&& stagingState === "open" ? () => { } : () => { displayTracks(props.libraryItem); }}></img>

            <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
                <div className={"user-playlist-details-container"} style={{}} >
                    <p className="playlist-name playlist-card-text">{props.libraryItem.name !== "" ? props.libraryItem.name : "Untitled"}</p>
                    {props.libraryItem.type === "album" ?
                        <p className="playlist-card-text">{props.libraryItem.artists[0].name}</p> : props.libraryItem.type === "playlist" ?
                            <p className="playlist-card-text">{props.libraryItem.owner.display_name}</p> : <></>}

                    <p className="playlist-card-text" style={{ flex: "1", minWidth: "50%" }}>{props.libraryItem.totalTracks}  tracks</p>


                </div>

            </div>
        </div>
    )
}


export default LibraryItemCard