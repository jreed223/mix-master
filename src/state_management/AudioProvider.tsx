import React, { createContext, useEffect, useMemo, useState } from "react"
import TrackClass from "../models/Tracks.ts";



export type AudioState = {url:string, audio: HTMLAudioElement, audioDetails: {
    trackId: string;
    artist: string;
    title: string;
    track: TrackClass;
}}
export type AudioContextType = {


    currentAudio: AudioState
    setCurrentAudio: React.Dispatch<React.SetStateAction<AudioState>>,
    currentAudioColor: string,
}

    const AudioContext = createContext<AudioContextType>(null)


export default function AudioProvider({children}){
    const [currentAudio, setCurrentAudio] = useState<AudioState>(null)
    const [currentAudioColor, setCurrentAudioColor] = useState<"#59b759"|"#e56767"|null>(null)

    useEffect(()=>{

        if(currentAudio){
            currentAudio.audio.addEventListener('playing',()=>{
                console.log('PLAYING! PLAYING! PLAYING!')
                setCurrentAudioColor("#59b759")
            })
    
            currentAudio.audio.addEventListener('pause',()=>{
                console.log('PAUSED! PAUSED! PAUSED!')
                setCurrentAudioColor("#e56767")
            })
            currentAudio.audio.addEventListener('ended', ()=>{
                // setAudioDetails(null)
                setCurrentAudioColor(null)})

            return()=>{
                currentAudio.audio.removeEventListener('playing', ()=> setCurrentAudioColor("#59b759"))
                currentAudio.audio.removeEventListener('pause', ()=>setCurrentAudioColor("#e56767"))
                currentAudio.audio.removeEventListener('ended', ()=>{
                    // setAudioDetails(null)
                    setCurrentAudioColor(null)})

    
            }

        }

    },[currentAudio, currentAudio?.audio])







    const context: AudioContextType = useMemo(()=>({currentAudio, setCurrentAudio, currentAudioColor, }), [currentAudio, currentAudioColor, setCurrentAudio])



    return(
        <AudioContext.Provider value={context}>
            {children}
        </AudioContext.Provider>
    )
}

export {AudioContext}