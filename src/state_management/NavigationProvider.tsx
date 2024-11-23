import React, { createContext, useEffect, useMemo, useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
// import { Button } from "@mui/material";


export type ViewName = 'Dashboard'|"Liked Playlists"|"User Playlists"|"Liked Albums"
export type NavigationContextType = {
    activeView:  ViewName[]
    setActiveView: React.Dispatch<React.SetStateAction<ViewName[]>>
    isSearching: boolean
    setIsSearching: React.Dispatch<React.SetStateAction<boolean>>
    stagingState: string
    setStagingState: React.Dispatch<React.SetStateAction<string>>
    primaryView: ViewName
    setPrimaryView: React.Dispatch<React.SetStateAction<ViewName>>
    currentAudio: {url:string, audio: HTMLAudioElement}
    setCurrentAudio: React.Dispatch<React.SetStateAction<{
        url: string;
        audio: HTMLAudioElement;
    }>>,
    currentAudioColor: string,
    audioDetails: {artist: string, title: string}
    setAudioDetails: React.Dispatch<React.SetStateAction<{
        artist: string;
        title: string;
    }>>
}
    const NavigationContext = createContext<NavigationContextType>(null)


export default function NavigationProvider({children}){
    const [activeView, setActiveView] = useState<ViewName[]>(["Dashboard"])
    const [primaryView, setPrimaryView] = useState<ViewName>("User Playlists")
    const [currentAudio, setCurrentAudio] = useState<{url:string, audio: HTMLAudioElement}>(null)
    const [currentAudioColor, setCurrentAudioColor] = useState<"#59b759"|"#e56767"|null>(null)
    const [audioDetails, setAudioDetails] = useState<{artist: string, title: string}>(null)


    const [isSearching, setIsSearching] = useState(false)
    const [stagingState, setStagingState] = useState<string>("closed")


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
                setAudioDetails(null)
                setCurrentAudioColor(null)})

            return()=>{
                currentAudio.audio.removeEventListener('playing', ()=> setCurrentAudioColor("#59b759"))
                currentAudio.audio.removeEventListener('pause', ()=>setCurrentAudioColor("#e56767"))
                currentAudio.audio.removeEventListener('ended', ()=>{
                    setAudioDetails(null)
                    setCurrentAudioColor(null)})

    
            }

        }



    },[currentAudio, currentAudio?.audio])

    const context = useMemo(()=>({activeView, setActiveView, isSearching, setIsSearching, stagingState, setStagingState, primaryView, setPrimaryView, currentAudio, setCurrentAudio, currentAudioColor, audioDetails, setAudioDetails}), [activeView, audioDetails, currentAudio, currentAudioColor, isSearching, primaryView, stagingState])



    return(
        <NavigationContext.Provider value={context}>
            {children}
        </NavigationContext.Provider>
    )
}

export {NavigationContext}