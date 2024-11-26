import React, { useContext, useEffect, useState } from "react";
import TrackClass from '../../../models/Tracks';
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

const TrackCard: React.FC<TrackCardProps> = (
    props
//     {
//     tracklistArea,

//     onSelectedTrack,
//     trackClass,
//     displayHidden,
//     selectedLibraryItems,
//     draftTrack,
//     deselectTrack

// }
)=>{

    const {currentAudio, setCurrentAudio, currentAudioColor,stageTracks, stagedPlaylist} = useContext<NavigationContextType>(NavigationContext)

    const [isChecked, setIsChecked]= useState(false)


useEffect(()=>{
    if(props.selectedLibraryItems.some((libraryItem)=>libraryItem?.track?.id===props.trackClass?.track?.id)){
        setIsChecked(true)
    }else{
        setIsChecked(false)
    }

}, [props.selectedLibraryItems, props.trackClass?.track?.id, props.tracklistArea])  

useEffect(()=>{
    if(props.tracklistArea!=="search-bar-card"){

    }else if(stagedPlaylist.some(track=>track.track.id===props.trackClass.track.id)){
        setIsChecked(true)
    }else{
        setIsChecked(false)
    }
})


    
    const handleCheck = ()=>{
        setIsChecked((prevState)=>!prevState);
        props.onSelectedTrack(!isChecked, props.trackClass )
    }


    const displayStyle = props.displayHidden?
        {display: 'none',
        textOverflow: 'ellipsis',
        color: "#878787"}:

            {
                display: 'flex',
                alignItems: 'center',
                width: props.tracklistArea==="search-bar-card"?"calc(50% - 10px)":"unset",
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
                    trackId: props.trackClass.track?.id,
                    artist: props.trackClass.track.artists[0].name,
                    title: props.trackClass.track.name,
                    track: props.trackClass
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
                    trackId: props.trackClass.track?.id,
                    artist: props.trackClass.track.artists[0].name,
                    title: props.trackClass.track.name,
                    track: props.trackClass
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
    console.log(props.trackClass.collection)
    const collection = props.trackClass.getCollection()
    const trackImgUrl = props.trackClass.track?.album?.images[0]?.url||props.trackClass.track?.images[0]?.url||collection.image.url
    return(
        <div className={`${props.tracklistArea} track-card`} id={props.trackClass?.track?.id} style={displayStyle}>
            
            {/* <input readOnly checked={isChecked} key={`checkbox-${track.id}`} type="checkbox" onClick={(e)=>handleCheck()}/> */}
            {props.tracklistArea==="draft-playlist"?
            <>
            <button style={{width:"40px", height: "100%", borderRadius: "10%"}} onClick={(e)=>{e.preventDefault(); props.draftTrack([props.trackClass]); props.deselectTrack(props.trackClass?.track?.id);}}>&#10006;
            </button>

                        <div style={{position: "relative", textAlign:"right",display:"flex", flexDirection:"column", flexGrow: '1', width: "0%", textWrap:'nowrap', height:"100%", justifyContent:'center'}}>
                        <p style={{margin:"0px", color: isChecked?"rgb(135, 135, 135, 0.35)":"inherit"}} className="track-card-text">{props.trackClass.track.name}</p>
                        <p style={{ margin:"0px", color: isChecked?"rgb(135, 135, 135, 0.35)":"inherit"}} className="track-card-text">{props.trackClass.track.artists[0].name}</p>
                        <div onClick={()=>handleCheck()} style={{top:0, left:0,width:"100%", height:"100%", position:"absolute",  }}></div>
                        </div>
                        </>
                :<></>}
            <div style={{position: "relative",height: "100%", aspectRatio: "1 / 1"}}>
            <img loading="lazy" style={{position:"relative", height: "100%", aspectRatio: "1 / 1"}}onClick={()=>handleCheck()} src={trackImgUrl}alt={`${props.trackClass.track.name} cover`}></img>
            <div onClick={()=>playPreviewAudio(props.trackClass?.track?.preview_url||null)} style={{color: props.trackClass?.track?.id===currentAudio?.audioDetails.trackId?currentAudioColor:"inherit",top:0, left:0,width:"100%", height:"100%", position:"absolute"}}>preview</div>
            </div>
            {props.tracklistArea==="selected-playlist"||props.tracklistArea==="search-bar-card"?
            <>
                        <div style={{position: "relative", display:"flex", flexDirection:"column",  overflow: 'hidden', flexGrow: '1', width: "0%", height:"100%", justifyContent:'center'}}>
                        <p style={{margin:"0px", color: isChecked?"rgb(135, 135, 135, 0.35)":"inherit"}} className="track-card-text">{props.trackClass.track.name}</p>
                        <p style={{ margin:"0px", color: isChecked?"rgb(135, 135, 135, 0.35)":"inherit"}} className="track-card-text">{props.trackClass.track.artists[0].name}</p>
                        <div onClick={props.tracklistArea!=="search-bar-card"?()=>handleCheck():()=>{}} style={{top:0, left:0,width:"100%", height:"100%", position:"absolute",  }}></div>
                        </div>

                        {props.tracklistArea==="search-bar-card"?<button disabled={stagedPlaylist.some(track=>track.track.id===props.trackClass.track.id)}style={{width:"40px", height: "100%", borderRadius: "10%"}} onClick={(e)=>{e.preventDefault(); stageTracks([props.trackClass]);}}>+
                        </button>:<button style={{width:"40px", height: "100%", borderRadius: "10%"}} onClick={(e)=>{e.preventDefault(); stageTracks([props.trackClass]); props.deselectTrack(props.trackClass.track.id)}}>+
                        </button>
                        }
                        </>
        
                : <></>}
            
        </div>
    )

}

export default TrackCard


