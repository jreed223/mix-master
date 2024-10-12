import React, { useEffect, useState } from "react";
import { Track } from "../../../../server/types";

export interface TrackCardProps{
    tracklistArea: string
    onSelectedTrack: (checked: boolean,selectedItem: Track) => void
    track : Track;
    displayHidden : boolean;
    selectedLibraryItems: Track[]
    draftTrack: (selectedItems: Track[]) => void

}

const TrackCard: React.FC<TrackCardProps> = ({
    tracklistArea,

    onSelectedTrack,
    track,
    displayHidden,
    selectedLibraryItems,
    draftTrack

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
            // {width:"100%",
            //     display: 'flex',
            // textOverflow: 'ellipsis',
            // color: "#878787"}
            {
                display: 'flex',
                alignItems: 'center',
                // border: isChecked?"1px solid #2fdc2fcf": "none",
                // boxShadow: isChecked?"rgb(1 255 7 / 75%) 0px 0px 25px inset":"none"

            }
    
    // if(props.displayHidden){
    // const artists = track.artists.map(artist=>artist.name)

    // }
    // console.log("checkbox checked? ", props.checked)
    // console.log(track.album.images)
    return(
        <div className="track-card" id={track.id} style={displayStyle}>
            
            {/* <input readOnly checked={isChecked} key={`checkbox-${track.id}`} type="checkbox" onClick={(e)=>handleCheck()}/> */}
            {tracklistArea==="draft playlist"?
            <>
            <button style={{width:"40px", height: "100%"}} onClick={()=>draftTrack([track])}>&lt;</button>
                        <div onClick={(e)=>handleCheck()} style={{textAlign:"right",display:"flex", flexDirection:"column",  overflow: 'hidden', flexGrow: '1', width: "0%"}}>
                        <p style={{margin:"0px", whiteSpace: "normal", overflow: "hidden", textOverflow: "ellipsis",}} className="track-card-text">{track.name}</p>
                        <p style={{ margin:"0px", whiteSpace: "normal", overflow: "hidden", textOverflow: "ellipsis"}} className="track-card-text">{track.artists[0].name}</p>
                        </div>
                        </>
                :<></>}
            <div style={{position: "relative",height: "100%", aspectRatio: "1 / 1"}}>
            <img style={{height: "100%", aspectRatio: "1 / 1"}}onClick={(e)=>handleCheck()} src={track.images[0].url}alt={`${track.name} cover`}></img>
            <div onClick={(e)=>handleCheck()} style={{top:0, left:0,width:"100%", height:"100%", position:"absolute", transition: " box-shadow 0.3s ease", boxShadow: isChecked?(tracklistArea==="selected playlist"?"rgb(1 255 7 / 75%) 0px 0px 25px inset":"rgb(255 1 1) 0px 0px 25px inset"):"none"}}></div>
            </div>
            {tracklistArea==="selected playlist"?
            <>
                        <div onClick={(e)=>handleCheck()} style={{display:"flex", flexDirection:"column",  overflow: 'hidden', flexGrow: '1', width: "0%"}}>
                        <p style={{margin:"0px", whiteSpace: "normal", overflow: "hidden", textOverflow: "ellipsis",}} className="track-card-text">{track.name}</p>
                        <p style={{ margin:"0px", whiteSpace: "normal", overflow: "hidden", textOverflow: "ellipsis"}} className="track-card-text">{track.artists[0].name}</p>
                        </div><button style={{width:"40px", height: "100%"}} onClick={()=>draftTrack([track])}>&gt;</button>
                        </>
        
                : <></>}

        </div>
    )

}

export default TrackCard


