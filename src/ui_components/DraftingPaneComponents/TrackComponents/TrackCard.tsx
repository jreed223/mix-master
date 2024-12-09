import React, { useContext, useEffect, useState } from "react";
import TrackClass from "../../../models/Tracks";
import { DraftingContext } from "../../../state_management/DraftingPaneProvider";
import { NavigationContext, NavigationContextType } from "../../../state_management/NavigationProvider";

export interface TrackCardProps{
    tracklistArea: string
    onSelectedTrack: (checked: boolean,selectedItem: TrackClass) => void
    trackClass : TrackClass;
    displayHidden : boolean;
    selectedLibraryItems: TrackClass[]
    draftTrack: (selectedItems: TrackClass[]|TrackClass) => void

deselectTrack: (trackId: string) => void

}

const TrackCard: React.FC<TrackCardProps> = ({
    tracklistArea,

    onSelectedTrack,
    trackClass,
    displayHidden,
    selectedLibraryItems,
    draftTrack,
    deselectTrack

})=>{

    const {currentAudio, setCurrentAudio, currentAudioColor} = useContext<NavigationContextType>(NavigationContext)

    const [isChecked, setIsChecked]= useState(false)


useEffect(()=>{
    if(selectedLibraryItems.some((libraryItem)=>libraryItem?.track?.id===trackClass?.track?.id)){
        setIsChecked(true)
    }else{
        setIsChecked(false)
    }

}, [selectedLibraryItems, trackClass?.track?.id, tracklistArea])  


    
    const handleCheck = ()=>{
        setIsChecked((prevState)=>!prevState);
        onSelectedTrack(!isChecked, trackClass )
    }


    const displayStyle = displayHidden?
        {display: 'none',
        textOverflow: 'ellipsis',
        color: "#878787"}:

            {
                display: 'flex',
                alignItems: 'center',
                width: tracklistArea==="search-bar-card"?"calc(50% - 10px)":"unset",
                backgroundColor: isChecked?"#00000061":"inherit"
            }

    // useEffect(()=>{
    //     if(trackClass?.track?.id!==currentAudio?.audioDetails.trackId){
    //         setPreviewState(null)
    //     }else{
    //         setPreviewState(currentAudioColor)

    //     }
    // }, [currentAudio?.audioDetails.trackId, currentAudioColor, trackClass?.track?.id])

   
    // const [previewState, setPreviewState] = useState(currentAudio?.url===trackClass.track?.preview_url?(currentAudio?.audio?.paused?"#e56767":"#59b759"):null)
    const playPreviewAudio = (url)=>{
        const audio = new Audio(url)


        if(currentAudio===null){
            // setPreviewState("#59b759")
            audio?.play().catch((e)=>{
                console.log('Failed to play audio resource: ', e)
            })

            setCurrentAudio({
                audioDetails:{
                    trackId: trackClass.track?.id,
                    artist: trackClass.track.artists[0].name,
                    title: trackClass.track.name,
                    track: trackClass
                },
                url: url,
                audio: audio})
                return
        }
        if(currentAudio.url!==url){
            currentAudio.audio?.pause()
            audio.play().catch((e)=>{
                console.log('Failed to play audio resource: ', e)
            })
            // setPreviewState("#59b759")
            setCurrentAudio({
                audioDetails:{
                    trackId: trackClass.track?.id,
                    artist: trackClass.track.artists[0].name,
                    title: trackClass.track.name,
                    track: trackClass
                },
                url: url,
                audio: audio})
            // setAudioDetails({
            //     artist: trackClass.track.artists[0].name,
            //     title: trackClass.track.name
            // })

        }else{
            if(currentAudio.audio.paused === true){
                currentAudio.audio?.play()
                // setPreviewState("#59b759")

            }else{
                currentAudio.audio?.pause()
                // setPreviewState("#e56767")



            }

        }
        
    }    // if(props.displayHidden){

    const trackImgUrl = trackClass.track?.album?.images[0]?.url||trackClass?.getCollection()?.image.url||trackClass.track?.images[0]?.url
    return(
        <div className={`${tracklistArea} track-card`} id={trackClass?.track?.id} style={displayStyle}>
            
            {/* <input readOnly checked={isChecked} key={`checkbox-${track.id}`} type="checkbox" onClick={(e)=>handleCheck()}/> */}
            {tracklistArea==="draft-playlist"?
            <>
            <button style={{width:"40px", height: "100%", borderRadius: "10%"}} onClick={()=>{draftTrack([trackClass]); deselectTrack(trackClass?.track?.id);}}>&#10006;
            </button>

                        <div style={{position: "relative", textAlign:"right",display:"flex", flexDirection:"column", flexGrow: '1', width: "0%", textWrap:'nowrap', height:"100%", justifyContent:'center'}}>
                        <p style={{margin:"0px", color: isChecked?"rgb(135, 135, 135, 0.35)":"inherit"}} className="track-card-text">{trackClass.track.name}</p>
                        <p style={{ margin:"0px", color: isChecked?"rgb(135, 135, 135, 0.35)":"inherit"}} className="track-card-text">{trackClass.track.artists[0].name}</p>
                        <div onClick={()=>handleCheck()} style={{top:0, left:0,width:"100%", height:"100%", position:"absolute",  }}></div>
                        </div>
                        </>
                :<></>}
            <div style={{position: "relative",height: "100%", aspectRatio: "1 / 1"}}>
            <img loading="lazy" style={{position:"relative", height: "100%", aspectRatio: "1 / 1"}}onClick={()=>handleCheck()} src={trackImgUrl}alt={`${trackClass.track.name} cover`}></img>
            <div onClick={()=>playPreviewAudio(trackClass?.track?.preview_url||null)} style={{color: trackClass?.track?.id===currentAudio?.audioDetails.trackId?currentAudioColor:"inherit",top:0, left:0,width:"100%", height:"100%", position:"absolute"}}>preview</div>
            </div>
            {tracklistArea==="selected-playlist"||tracklistArea==="search-bar-card"?
            <>
                        <div style={{position: "relative", display:"flex", flexDirection:"column",  overflow: 'hidden', flexGrow: '1', width: "0%", height:"100%", justifyContent:'center'}}>
                        <p style={{margin:"0px", color: isChecked?"rgb(135, 135, 135, 0.35)":"inherit"}} className="track-card-text">{trackClass.track.name}</p>
                        <p style={{ margin:"0px", color: isChecked?"rgb(135, 135, 135, 0.35)":"inherit"}} className="track-card-text">{trackClass.track.artists[0].name}</p>
                        <div onClick={()=>handleCheck()} style={{top:0, left:0,width:"100%", height:"100%", position:"absolute",  }}></div>
                        </div>

                        <button style={{width:"40px", height: "100%", borderRadius: "10%"}} onClick={()=>{draftTrack([trackClass]); deselectTrack(trackClass.track.id)}}>+

                        </button>
                        </>
        
                : <></>}
            
        </div>
    )

}

export default TrackCard


