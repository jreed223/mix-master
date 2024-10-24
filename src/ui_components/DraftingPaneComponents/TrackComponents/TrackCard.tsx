import React, { useEffect, useState } from "react";
import { Track } from "../../../../server/types";
import { relative } from 'path';

export interface TrackCardProps{
    tracklistArea: string
    onSelectedTrack: (checked: boolean,selectedItem: Track) => void
    track : Track;
    displayHidden : boolean;
    selectedLibraryItems: Track[]
    draftTrack: (selectedItems: Track[]) => void
    currentAudio: {url:string, audio: HTMLAudioElement}
    setCurrentAudio: React.Dispatch<React.SetStateAction<{
    url: string;
    audio: HTMLAudioElement;
}>>
deselectTrack: (trackId: string) => void

}

const TrackCard: React.FC<TrackCardProps> = ({
    tracklistArea,

    onSelectedTrack,
    track,
    displayHidden,
    selectedLibraryItems,
    draftTrack,
    currentAudio,
    setCurrentAudio,
    deselectTrack

})=>{

    const [isChecked, setIsChecked]= useState(false)

//TODO: Seperate Selected Draft Items and selected plailist items
useEffect(()=>{
    if(selectedLibraryItems.some((libraryItem)=>libraryItem.id===track.id)){
        setIsChecked(true)
    }else{
        setIsChecked(false)
    }

}, [selectedLibraryItems, track.id, tracklistArea])  


    
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

    useEffect(()=>{
        if(track?.preview_url!==currentAudio?.url){
            setPreviewState(null)
        }else{
            currentAudio.audio.addEventListener('ended', ()=>setPreviewState(null))
        }
    }, [track?.preview_url, currentAudio?.url, currentAudio?.audio])

   
    // const [currentAudio, setCurrentAudio] = useState<{url:string, audio: HTMLAudioElement}>(null)
    const [previewState, setPreviewState] = useState(currentAudio?.url===track.preview_url?(currentAudio?.audio.paused?"#e56767":"#59b759"):null)
    const playPreviewAudio = (url)=>{
        const audio = new Audio(url)

        if(currentAudio===null){
            setPreviewState("#59b759")
            audio.play()
            setCurrentAudio({
                url: url,
                audio: audio})
                return
        }
        if(currentAudio.url!==url){
            currentAudio.audio.pause()
            audio.play()
            setPreviewState("#59b759")
            setCurrentAudio({
                url: url,
                audio: audio})

        }else{
            if(currentAudio.audio.paused === true){
                currentAudio.audio.play()
                setPreviewState("#59b759")

            }else{
                currentAudio.audio.pause()
                setPreviewState("#e56767")



            }
            // console.log("PAUSED", currentAudio.audio.paused)
            // setCurrentAudio(null)
        }
        
    }    // if(props.displayHidden){
    // const artists = track.artists.map(artist=>artist.name)

    // }
    // console.log("checkbox checked? ", props.checked)
    // console.log(track.album.images)
    return(
        <div className={`${tracklistArea} track-card`} id={track.id} style={displayStyle}>
            
            {/* <input readOnly checked={isChecked} key={`checkbox-${track.id}`} type="checkbox" onClick={(e)=>handleCheck()}/> */}
            {tracklistArea==="draft-playlist"?
            <>
            <button style={{width:"40px", height: "100%"}} onClick={()=>{draftTrack([track]); deselectTrack(track.id);}}>&lt;</button>
            {/* <div onClick={()=>playPreviewAudio(track.preview_url)} style={{color: !previewState?"inherit":previewState}}>preview</div> */}

                        <div style={{position: "relative", textAlign:"right",display:"flex", flexDirection:"column", flexGrow: '1', width: "0%", textWrap:'nowrap', height:"100%", justifyContent:'center'}}>
                        <p style={{margin:"0px"}} className="track-card-text">{track.name}</p>
                        <p style={{ margin:"0px"}} className="track-card-text">{track.artists[0].name}</p>
                        <div onClick={(e)=>handleCheck()} style={{backgroundColor: isChecked?"#00000061":"inherit",top:0, left:0,width:"100%", height:"100%", position:"absolute",  }}></div>
                        </div>
                        </>
                :<></>}
            <div style={{position: "relative",height: "100%", aspectRatio: "1 / 1"}}>
            <img style={{position:"relative", height: "100%", aspectRatio: "1 / 1"}}onClick={(e)=>handleCheck()} src={(track?.album?.images[0]?.url)?(track.album.images[0].url):(track?.images[0]?.url)}alt={`${track.name} cover`}></img>
            <div onClick={()=>playPreviewAudio(track.preview_url)} style={{color: !previewState?"inherit":previewState,top:0, left:0,width:"100%", height:"100%", position:"absolute"}}>preview</div>
            </div>
            {tracklistArea==="selected-playlist"?
            <>
                        <div style={{position: "relative", display:"flex", flexDirection:"column",  overflow: 'hidden', flexGrow: '1', width: "0%", height:"100%", justifyContent:'center'}}>
                        <p style={{margin:"0px"}} className="track-card-text">{track.name}</p>
                        <p style={{ margin:"0px"}} className="track-card-text">{track.artists[0].name}</p>
                        <div onClick={(e)=>handleCheck()} style={{backgroundColor: isChecked?"#00000061":"inherit",top:0, left:0,width:"100%", height:"100%", position:"absolute",  }}></div>
                        </div>
                        {/* <div onClick={()=>playPreviewAudio(track.preview_url)} style={{color: !previewState?"inherit":previewState}}>preview</div> */}

                        <button style={{width:"40px", height: "100%"}} onClick={()=>{draftTrack([track]); deselectTrack(track.id)}}>&gt;</button>
                        </>
        
                : <></>}

        </div>
    )

}

export default TrackCard


