import React, { createContext, useCallback, useEffect, useMemo, useState } from "react"
import TrackCollection from "../models/libraryItems"
import TrackClass from "../models/Tracks";
import { LibraryItemCardProps } from "../ui_components/SearchPane/UserLibrary/LibraryItemCard";
import { UserProfile } from "../../server/types";
// import { UserProfile } from '@spotify/web-api-ts-sdk';
// import { Button } from "@mui/material";


export type ViewName = 'Dashboard'|"Liked Playlists"|"User Playlists"|"Liked Albums"|"All Playlists"
export type AudioState = {url:string, audio: HTMLAudioElement, audioDetails: {
    trackId: string;
    artist: string;
    title: string;
    track: TrackClass;
}}
export type NavigationContextType = {
    stagingState: string
    setStagingState: React.Dispatch<React.SetStateAction<string>>

    currentAudio: AudioState
    setCurrentAudio: React.Dispatch<React.SetStateAction<AudioState>>,
    currentAudioColor: string,
    selectedLibraryItem: TrackCollection, 
    setSelectedLibraryItem:React.Dispatch<React.SetStateAction<TrackCollection>>,
    stagedPlaylist: TrackClass[], 
    setStagedPlaylist: React.Dispatch<React.SetStateAction<TrackClass[]>>,
    stagedPlaylistState:TrackClass[][], 
    setStagedPlaylistState: React.Dispatch<React.SetStateAction<TrackClass[][]>>,
    stageTracks: (items: TrackClass[]) => void,
    unstageTracks: (items: TrackClass[]) => void,
    setUser: React.Dispatch<React.SetStateAction<UserProfile>>,
    user: UserProfile,

    setIsMobile: React.Dispatch<React.SetStateAction<boolean>>,
    isMobile: boolean
    setIsPlaylistsView: React.Dispatch<React.SetStateAction<boolean>>,

    isPlaylistsView: boolean,
    setIsMaxDraftView: React.Dispatch<React.SetStateAction<boolean>>,

    isMaxDraftView: boolean


    // audioDetails: {artist: string, title: string}
    // setAudioDetails: React.Dispatch<React.SetStateAction<{
    //     artist: string;
    //     title: string;
    // }>>
}
    const NavigationContext = createContext<NavigationContextType>(null)


export default function NavigationProvider({children}){
    const [currentAudio, setCurrentAudio] = useState<AudioState>(null)
    const [currentAudioColor, setCurrentAudioColor] = useState<"#59b759"|"#e56767"|null>(null)
    const [selectedLibraryItem, setSelectedLibraryItem] = useState<TrackCollection | null>(null)
    const [stagedPlaylist, setStagedPlaylist] = useState<TrackClass[]>([])
    // const [userLibraryItems, setUserLibraryItems] = useState<TrackCollection[]>()
    const [stagedPlaylistState, setStagedPlaylistState] = useState<TrackClass[][]>([[]])
    // const [userPlaylistCards, setUserPlaylistCards] = useState<React.ReactElement<LibraryItemCardProps>[]>()
    const [user, setUser] = useState<UserProfile>(null);
    const [isMobile, setIsMobile] = useState(false)
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    const [isPlaylistsView, setIsPlaylistsView] = useState(true)
    const [isMaxDraftView, setIsMaxDraftView] = useState(false)


    // const [audioDetails, setAudioDetails] = useState<{artist: string, title: string}>(null)


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



    useEffect(()=>{
        const setViewStyle = ()=>{
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
              });
          
        }
        setViewStyle()
        window.addEventListener('resize', setViewStyle)

        return () => {
          window.removeEventListener('resize', setViewStyle);
        };
    },[])
    useEffect(()=>{
        if((windowSize.width<900)||((windowSize.width/2)-125 < windowSize.height/4)){
            setIsMobile(true)
        }else{
            setIsMobile(false)
        }
    },[windowSize.height, windowSize.width])



    const stageTracks =useCallback((items:TrackClass[])=>{
        const newStagedPlaylist = stagedPlaylist.concat(items)
        setStagedPlaylist(newStagedPlaylist)
        setStagedPlaylistState(stagedPlaylistState.concat([newStagedPlaylist]))
        setStagingState("open")
        console.log("Added items: ",items)
        console.log("new Staged Playlist: ",newStagedPlaylist)
        console.log(stagedPlaylistState)


    },[stagedPlaylist, stagedPlaylistState])

    const unstageTracks = useCallback((items: TrackClass[]) => {
        const newStagedPlaylist = stagedPlaylist.filter(stagedItem => !items.some(removedItem => removedItem.track.id === stagedItem.track.id))
        setStagedPlaylist(newStagedPlaylist)
        setStagedPlaylistState(stagedPlaylistState.concat([newStagedPlaylist]))
        console.log("Removed items: ", items)
        console.log("new Staged Playlist: ", newStagedPlaylist)
        console.log(stagedPlaylistState)

    }, [setStagedPlaylist, setStagedPlaylistState, stagedPlaylist, stagedPlaylistState])

    const context: NavigationContextType = useMemo(()=>({isMaxDraftView, setIsMaxDraftView, setIsPlaylistsView, isPlaylistsView, isMobile, setIsMobile, user, setUser, stagingState, setStagingState, currentAudio, setCurrentAudio, currentAudioColor, selectedLibraryItem, setSelectedLibraryItem, stagedPlaylist, setStagedPlaylist, stagedPlaylistState, setStagedPlaylistState, stageTracks, unstageTracks }), [currentAudio, currentAudioColor, isMaxDraftView, isMobile, isPlaylistsView, selectedLibraryItem, stageTracks, stagedPlaylist, stagedPlaylistState, stagingState, unstageTracks, user])



    return(
        <NavigationContext.Provider value={context}>
            {children}
        </NavigationContext.Provider>
    )
}

export {NavigationContext}