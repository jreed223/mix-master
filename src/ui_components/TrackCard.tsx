import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { PlaylistItem, Track } from "../../server/types";
import { Checkbox } from "@mui/material";
import Library from "../models/libraryItems";

export interface TrackCardProps{

    onSelectedTrack: (checked: boolean,selectedItem: Track) => void
    track : Track;
    displayHidden : boolean;
    
    selectedLibraryItems: Track[]

}

const TrackCard: React.FC<TrackCardProps> = ({

    onSelectedTrack,
    track,
    displayHidden,
    selectedLibraryItems

})=>{

    const [isChecked, setIsChecked]= useState(false)


useEffect(()=>{
    if(selectedLibraryItems.some((libraryItem)=>libraryItem.id===track.id)){
        setIsChecked(true)
    }else{
        setIsChecked(false)
    }


}, [selectedLibraryItems, track.id])  


    
    const handleCheck = ()=>{
        setIsChecked((prevState)=>!prevState);
        onSelectedTrack(!isChecked, track )


    }


    const displayStyle = displayHidden?
        {display: 'none',
        textOverflow: 'ellipsis',
        color: "#878787"}:
            {display: 'flex',
            textOverflow: 'ellipsis',
            color: "#878787"}
    
    // if(props.displayHidden){

    // }
    // console.log("checkbox checked? ", props.checked)
    return(
        <div className="track-card" id={track.id} style={displayStyle}>
            <input readOnly checked={isChecked} key={`checkbox-${track.id}`} type="checkbox" onClick={(e)=>handleCheck()}/>
            <label>{track.name} - {track.artists[0].name}</label>
        </div>
    )

}

export default TrackCard


