import React, { useContext, useEffect, useState } from "react";
import TrackClass from '../../../models/Tracks.ts';
import { DraftingContext, DraftingContextType } from "../../../state_management/DraftingPaneProvider.tsx";
import { ViewContext, ViewContextType } from "../../../state_management/ViewProvider.tsx";
import { AudioContext, AudioContextType } from "../../../state_management/AudioProvider.tsx";
import { minHeight } from "@mui/system";

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

    const {currentAudio, setCurrentAudio, currentAudioColor} = useContext<AudioContextType>(AudioContext)
    const {stageTracks, stagedPlaylist, setStagingState} = useContext<DraftingContextType>(DraftingContext)
    const {isMobile, setSelectedProfile, setDisplayProfile} = useContext(ViewContext)

    const [isChecked, setIsChecked]= useState(false)


useEffect(()=>{
    if(props.tracklistArea!=="search-bar-card"){
        if(props.selectedLibraryItems.some((libraryItem)=>libraryItem?.track?.id===props.trackClass?.track?.id)){
            setIsChecked(true)
        }else{
            setIsChecked(false)
        }

    }
   

}, [props.selectedLibraryItems, props.trackClass?.track?.id, props.tracklistArea])  

useEffect(()=>{
    if(props.tracklistArea!=="search-bar-card"){

    }else if(stagedPlaylist.some(track=>track.track.id===props.trackClass.track.id)){
        setIsChecked(true)
    }else{
        setIsChecked(false)
    }
},[props.trackClass.track.id, props.tracklistArea, stagedPlaylist])


    
    const handleCheck = ()=>{
        setIsChecked((prevState)=>!prevState);
        props.onSelectedTrack(!isChecked, props.trackClass )
    }


    const displayStyle = props.displayHidden?
        {display: 'none',
        textOverflow: 'ellipsis',
        color: "#878787"}:

            {
                minHeight:isMobile?'50px':'60px',
                height:isMobile?props.tracklistArea==="search-bar-card"?'8vh':'7vh':props.tracklistArea==="search-bar-card"?'12vh':'11vh',
                display: 'flex',
                alignItems: 'center',
                width: props.tracklistArea==="search-bar-card"?"calc(50% - 10px)":"unset",
                backgroundColor: isChecked?"#00000061":"inherit",
                borderBottomLeftRadius: props.tracklistArea!=="draft-playlist"? "7px": "0",
                borderTopLeftRadius: props.tracklistArea!=="draft-playlist"? "7px": "0",
                borderBottomRightRadius: props.tracklistArea==="draft-playlist"? "7px": "0",
                borderTopRightRadius: props.tracklistArea==="draft-playlist"? "7px": "0",
                
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
  
    const trackImgUrl = props.trackClass.track?.album?.images[0]?.url||props.trackClass.getCollection().image.url||props.trackClass.track?.images[0]?.url
    return(
        <div className={`${props.tracklistArea} track-card`}  id={props.trackClass?.track?.id} style={displayStyle}>
            
            {/* <input readOnly checked={isChecked} key={`checkbox-${track.id}`} type="checkbox" onClick={(e)=>handleCheck()}/> */}
            {props.tracklistArea==="draft-playlist"?
            <>
            <button style={{width:"40px", height: "100%", borderRadius: "10%"}} onClick={(e)=>{e.preventDefault(); props.draftTrack([props.trackClass]); props.deselectTrack(props.trackClass?.track?.id);}}>&#10006;
            </button>

                        <div onClick={()=>handleCheck()}  style={{marginRight:"7px", cursor:"pointer",position: "relative", textAlign:"right",display:"flex", flexDirection:"column", flexGrow: '1', width: "0%", textWrap:'nowrap', height:"100%", justifyItems:'end'}}>

                        <p style={{margin:"0px", fontSize: "1.25em",color: isChecked?"rgb(135, 135, 135, 0.35)":"inherit"}} className="track-card-text">{props.trackClass.track.name}</p>

                        <div style={{maxWidth:"100%",marginLeft:'auto',textAlign:"right",  width: 'min-content', textWrap:'nowrap', justifyContent:'center'}}>
                        <p onClick={(e)=>{if(!isMobile){e.stopPropagation(); setDisplayProfile(true); setSelectedProfile({type: 'artist', profileId: props.trackClass.track.artists.at(0).id });}}} style={{fontSize: "1em", cursor:'pointer', margin:"0px", color: isChecked?"rgb(135, 135, 135, 0.35)":"inherit"}} className={`track-card-text ${!isMobile?"artist-text":""}`}>{props.trackClass.track.artists[0].name}</p>
                        {props.trackClass.collection.type==="album"&&props.trackClass.collection.albumType!=="single"?<p className="track-card-text" style={{margin:"0px", color: isChecked?"rgb(135, 135, 135, 0.35)":"inherit"}}>{props.trackClass.track.album.name}</p>:<></>}
                        </div>
                        </div>
                        </>
                :<></>}
            <div style={{position: "relative",height: "100%", aspectRatio: "1 / 1"}}>
            <img loading="lazy" style={{position:"relative", height: "100%", aspectRatio: "1 / 1", cursor: props.tracklistArea!=="search-bar-card"?"pointer":"default"}}onClick={props.tracklistArea!=="search-bar-card"?()=>handleCheck():()=>{}} src={trackImgUrl}alt={`${props.trackClass.track.name} cover`}></img>
            {props.trackClass?.track?.preview_url?
                <div onClick={props.trackClass?.track?.preview_url?()=>playPreviewAudio(props.trackClass?.track?.preview_url):()=>{console.log(`${props.trackClass.track.name} PREVIEW_URL: ${props.trackClass.track.preview_url}`)}} style={{cursor:props.trackClass?.track?.preview_url?"pointer":"default", color: props.trackClass?.track?.id===currentAudio?.audioDetails.trackId?currentAudioColor:"inherit",top:0, left:0,width:"100%", height:"100%", position:"absolute"}}>preview</div>
                :<></>
            }
            </div>
            {props.tracklistArea==="selected-playlist"||props.tracklistArea==="search-bar-card"?
            <>
                        <div onClick={props.tracklistArea!=="search-bar-card"?()=>handleCheck():()=>{}}  style={{marginLeft: "7px", cursor:props.tracklistArea!=="search-bar-card"?'pointer':"default", position: "relative", display:"flex", flexDirection:"column",  overflow: 'hidden', flexGrow: '1', width: "0%", height:"100%", justifyContent:'center'}}>

                        <p style={{margin:"0px",fontSize: "1.25em", color: isChecked?"rgb(135, 135, 135, 0.35)":"inherit"}} className="track-card-text">{props.trackClass.track.name}</p>
                        
                        <div style={{maxWidth:"100%",  width: 'min-content', textWrap:'nowrap', justifyContent:'center'}}>

                        <p onClick={(e)=>{if(!isMobile||props.tracklistArea==="search-bar-card"){e.stopPropagation(); setDisplayProfile(true); setSelectedProfile({type: 'artist', profileId: props.trackClass.track.artists.at(0).id });}}} style={{fontSize: "1em", cursor:'pointer', margin:"0px", color: isChecked?"rgb(135, 135, 135, 0.35)":"inherit"}} className={`track-card-text ${!isMobile?"artist-text":""}`}>{props.trackClass.track.artists[0].name}</p>
                        {props.trackClass.collection.type==="album"&&props.trackClass.collection.albumType!=="single"?<p className="track-card-text" style={{fontSize:"1em", margin:"0px", color: isChecked?"rgb(135, 135, 135, 0.35)":"inherit"}}>{props.trackClass.collection.name}</p>:<></>}

                        </div>



                        </div>

                        {props.tracklistArea==="search-bar-card"
                        ?<button disabled={stagedPlaylist.some(track=>track.track.id===props.trackClass.track.id)}style={{width:"40px", height: "100%", borderRadius: "10%"}} onClick={(e)=>{e.preventDefault(); setStagingState(prev=>isMobile?prev:"open"); stageTracks([props.trackClass]);}}>
                            +
                        </button>
                        :<button style={{width:"40px", height: "100%", borderRadius: "10%"}} onClick={(e)=>{e.preventDefault(); stageTracks([props.trackClass]); props.deselectTrack(props.trackClass.track.id)}}>
                            +
                        </button>
                        }
                        </>
        
                : <></>}
            
        </div>
    )

}

export default TrackCard


