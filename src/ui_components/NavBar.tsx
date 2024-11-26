import React, { useCallback, useContext, useEffect, useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import UserLibrary from './SinglePageView';
import { UserProfile } from "../../server/types";
import { AudioState, NavigationContext } from "../state_management/NavigationProvider";
import TrackClass from "../models/Tracks";
// import { Button } from "@mui/material";

interface navProps{
    currentUser: UserProfile
}
export type ViewName = 'Dashboard'|"Liked Playlists"|"User Playlists"|"Liked Albums"



export default function NavBar({currentUser}:navProps){
    // const [activeView, setActiveView] = useState<ViewName[]>(["Dashboard"])
    // const [,setDisabledDashboard] = useState(false)
    // const [isSearching, setIsSearching] = useState(false)
    // const [stagingState, setStagingState] = useState<string>("closed")
    // const {selectedLibraryItem, setSelectedLibraryItem, stagedPlaylist, setStagedPlaylist} = useContext(NavigationContext)

    const {setActiveView, activeView, setIsSearching, isSearching, stagingState, setStagingState, currentAudio, currentAudioColor, selectedLibraryItem, setSelectedLibraryItem, stagedPlaylist, setStagedPlaylist, setCurrentAudio, unstageTracks, stageTracks } = useContext(NavigationContext)
    const mixMasterButton = useCallback(()=>{
            if(stagingState==='closed'){
                if(activeView.at(-1)==="Dashboard"){
                    setActiveView(["User Playlists"])
                }
                setStagingState("open")
            }else{
                setStagingState('closed')
                setIsSearching(false)
                setActiveView(['Dashboard'])
            }

    },[activeView, setActiveView, setIsSearching, setStagingState, stagingState])

    const toggleAudio = ()=>{
        if(currentAudio.audio.paused === true){
            currentAudio.audio?.play()

        }else{
            currentAudio.audio?.pause()
        }
    }
    // const [currentCollection, setCurrentCollection] = useState<TrackClass[]>(null)
    const [audioIdx, setAudioIdx] = useState(null)


    useEffect(()=>{
        if(selectedLibraryItem){
            setAudioIdx(null)

        }
    },[selectedLibraryItem])



    useEffect(()=>{
        // const collection = currentAudio?.audioDetails?.track?.getCollection()
        // console.log("collection: ",collection)

        if(currentAudio&&selectedLibraryItem&& currentAudio.audioDetails.track.getCollection()?.id===selectedLibraryItem?.id){
            console.log(currentAudio.audioDetails.track.getCollection()?.id)
            // setCurrentCollection(selectedLibraryItem?.tracks)
            const currentIdx = selectedLibraryItem?.tracks?.findIndex((track)=>track.track?.id===currentAudio.audioDetails?.trackId)
            console.log("CURRENTIDX: ", currentIdx)
            setAudioIdx(currentIdx)
        }
     
    },[currentAudio, selectedLibraryItem])

    const prevAudio = useCallback(()=>{
        let audioPromise = currentAudio.audio.play()

        const currentTrack = selectedLibraryItem?.tracks?.at(audioIdx-1)

        if(!currentAudio.audio.paused||!currentAudio.audio.ended){
            if(audioPromise!==undefined){
                audioPromise.then(()=>
                    currentAudio.audio.pause()
                ).catch(e=>console.log(e))
            }
            // currentAudio.audio.pause()
        }

        const audio = new Audio(currentTrack.track.preview_url)

        const nextAudioState: AudioState = {
            url:currentTrack.track.preview_url,
            audio: audio,
            audioDetails: {
                trackId: currentTrack.track.id,
                artist: currentTrack.track.artists[0].name,
                title: currentTrack.track.name,
                track: currentTrack

            }
        }

        setCurrentAudio(nextAudioState)
        nextAudioState.audio.play()
    },[audioIdx, currentAudio?.audio, selectedLibraryItem, setCurrentAudio])


    const nextAudio = useCallback(async ()=>{
        let audioPromise = currentAudio.audio.play()

        if(!currentAudio.audio.paused||!currentAudio.audio.ended){
            if(audioPromise!==undefined){
                audioPromise.then(()=>
                    currentAudio.audio.pause()
                ).catch(e=>console.log(e))
            }
            // await currentAudio.audio.pause()
        }
        let nextAudioState: AudioState;
    if(audioIdx+1>=selectedLibraryItem.tracks.length||audioIdx===null){
        const currentTrack = selectedLibraryItem?.tracks?.at(0)

        const audio = new Audio(currentTrack.track.preview_url)
        nextAudioState = {
            url:currentTrack.track.preview_url,
            audio: audio,
            audioDetails: {
                trackId: currentTrack.track.id,
                artist: currentTrack.track.artists[0].name,
                title: currentTrack.track.name,
                track: currentTrack

            }
        }
    }else{
        const currentTrack = selectedLibraryItem?.tracks?.at(audioIdx+1)
        const audio = new Audio(currentTrack.track.preview_url)
        nextAudioState = {
            url:currentTrack.track.preview_url,
            audio: audio,
            audioDetails: {
                trackId: currentTrack.track.id,
                artist: currentTrack.track.artists[0].name,
                title: currentTrack.track.name,
                track: currentTrack
            }
        }

    }


        setCurrentAudio(nextAudioState)
        nextAudioState.audio.play()

    

    },[audioIdx, currentAudio?.audio, selectedLibraryItem, setCurrentAudio])

    const handleNav = (viewName: ViewName)=>{
        setActiveView((prev)=>[prev.at(-2),prev.at(-1), viewName])
        stagingState==="open"?setIsSearching(false):setIsSearching(prev=>prev)

    }

    return(

            <div style={{overflow: 'clip'}}>
                <span style={{color: "rgb(135, 135, 135)", overflow:"clip"}}className="navbar">
                   
                        <div  style={{width:"calc(50% - 50px)", margin: '0px 25px', alignItems:"center", display: "flex", position: 'relative'}}>
                        <h2 style={{margin: 0, cursor: "pointer"}} onClick={()=>{mixMasterButton()}} >Mix Master</h2>
                        {/* <div></div> */}
                        {currentAudio
                        ?(
                            <>
                            <div style={{margin:"0px 10px 0px 25px"}}>
                                <button style={{width: "30px", height:'30px', borderRadius:"50%"}} disabled={!(selectedLibraryItem && currentAudio)} onClick={()=>prevAudio()}>&lt;</button>
                                <button style={{width: "50px", height:'50px', borderRadius:"50%", margin:'0px 10px'}} disabled={!(currentAudio)} onClick={()=>toggleAudio()}>{currentAudioColor==="#59b759"?'Pause':'Play'}</button>
                                <button style={{width: "30px", height:'30px', borderRadius:"50%"}} disabled={!(selectedLibraryItem && currentAudio)} onClick={()=>nextAudio()}>&gt;</button>
                                
                            </div>
                            <button style={{width: "40px", height:'25px', borderRadius:"25px", marginRight: '10px'}}disabled={!(currentAudio)} onClick={()=>!stagedPlaylist?.some(track=>track?.track?.id===currentAudio?.audioDetails?.trackId)?stageTracks([currentAudio.audioDetails.track]):unstageTracks([currentAudio.audioDetails.track])}>
                                    {!stagedPlaylist?.some(track=>track?.track?.id===currentAudio?.audioDetails?.trackId)?'+':'X'}
                                </button>
                            <div style={{flex:1, width:"70%", display: "flex", margin: 0, alignItems:"center", overflow:'hidden'}}>
                            {/* <div style={{ width: "100%", display: "flex"}}> */}
     
                            <div style={{width:"100%"}}>{currentAudio?(<p style={{margin: 0, textWrap:'nowrap', textOverflow:'ellipsis', overflow:'hidden'}}>{`${currentAudio.audioDetails.title} by ${currentAudio.audioDetails?.artist}`}</p>):<></>}</div>
                            {/* <button disabled={!(currentAudio)||!stagedPlaylist.some(track=>track.track.id===currentAudio.audioDetails.trackId)} onClick={()=>unstageTracks([currentAudio.audioDetails.track])}></button> */}
                            
                            

                            {/* {currentAudio.audioDetails.collection?currentAudio.audioDetails.collection.tracks.findIndex((track)=>track.track.id===currentAudio.audioDetails.trackId)} */}
                        
                        {/* </div> */}
                       
                        </div>
                        </>
                        // <p>{`${currentAudio.audioDetails.title} by ${currentAudio.audioDetails?.artist}`}</p>
                        
                        )
                        :<></>
                        }
                        
                        </div>
                    <div style={{position: "absolute", left:"50%", transform: "translateY(-50%)", top: "50%", height: "100%", alignItems: "end", width: "40%", display: "flex",  gap:"25px" }}>
                    {/* <button style={{width:"calc(25% - 18.75px)", height: "70%"}} disabled={disabledDashboard} onClick={()=>{setActiveView((prev)=>[prev.at(-2),prev.at(-1),"Dashboard"])}}>Your Library</button> */}
                    <button disabled={activeView.at(-1)==="User Playlists"&&!(isSearching&&stagingState==='open')} style={{width:"calc(25% - 18.75px)", height: "70%", borderTopLeftRadius: '7px', borderTopRightRadius: '7px' }} onClick={()=>{setActiveView((prev)=>[prev.at(-2),prev.at(-1), "User Playlists"]); stagingState==="open"?setIsSearching(false):setIsSearching(prev=>prev)}}>My Playlists</button>
                    <button disabled={activeView.at(-1)==="Liked Playlists"&&!(isSearching&&stagingState==='open')} style={{width:"calc(25% - 18.75px)", height: "70%", borderTopLeftRadius: '7px', borderTopRightRadius: '7px'}} onClick={()=>{setActiveView((prev)=>[prev.at(-2), prev.at(-1), "Liked Playlists"]); stagingState==="open"?setIsSearching(false):setIsSearching(prev=>prev)}}>Liked Playlists</button>
                    <button disabled={activeView.at(-1)==="Liked Albums"&&!(isSearching&&stagingState==='open')} style={{width:"calc(25% - 18.75px)", height: "70%", borderTopLeftRadius: '7px', borderTopRightRadius: '7px'}} onClick={()=>{setActiveView((prev)=>[prev.at(-2),prev.at(-1),"Liked Albums"]); stagingState==="open"?setIsSearching(false):setIsSearching(prev=>prev)}}>Liked Albums</button>
                    </div>
                    <p>Welcome, {currentUser.display_name}</p>
                </span>
                <UserLibrary  currentUser={currentUser} ></UserLibrary>
            </div>
    )
}

