import React, { createContext, useEffect, useMemo, useState } from "react"
import type { UserProfile } from "../../server/types.d.ts";
import { ArtistProfileProps, UserProfileProps } from "../ui_components/LibrarySelectionComponents/SearchPane/ProfileView.tsx";
// import { UserProfile } from '@spotify/web-api-ts-sdk';
// import { Button } from "@mui/material";


export type ViewName = 'Dashboard'|"Liked Playlists"|"User Playlists"|"Liked Albums"|"All Playlists"


export type ViewContextType = {
    setUser: React.Dispatch<React.SetStateAction<UserProfile>>,
    user: UserProfile,
    setIsMobile: React.Dispatch<React.SetStateAction<boolean>>,
    isMobile: boolean
    setIsPlaylistsView: React.Dispatch<React.SetStateAction<boolean>>,
    isPlaylistsView: boolean,
    setIsMaxDraftView: React.Dispatch<React.SetStateAction<boolean>>,
    isMaxDraftView: boolean
    setDisplayProfile: React.Dispatch<React.SetStateAction<boolean>>
    displayProfile: boolean
    setSelectedProfile: React.Dispatch<React.SetStateAction<UserProfileProps | ArtistProfileProps>>
    selectedProfile: UserProfileProps | ArtistProfileProps
}
    
const ViewContext = createContext<ViewContextType>(null)


export default function ViewProvider({children}){
    const [displayProfile, setDisplayProfile] = useState(false)
    const [selectedProfile, setSelectedProfile] = useState<UserProfileProps|ArtistProfileProps>(null)
        
    

    const [user, setUser] = useState<UserProfile>(null);
    const [isMobile, setIsMobile] = useState(false)
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    const [isPlaylistsView, setIsPlaylistsView] = useState(true)
    const [isMaxDraftView, setIsMaxDraftView] = useState(false)

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



    const context: ViewContextType = useMemo(()=>({selectedProfile, setSelectedProfile, displayProfile, setDisplayProfile, isMaxDraftView, setIsMaxDraftView, setIsPlaylistsView, isPlaylistsView, isMobile, setIsMobile, user, setUser }), [displayProfile, isMaxDraftView, isMobile, isPlaylistsView, selectedProfile, user])



    return(
        <ViewContext.Provider value={context}>
            {children}
        </ViewContext.Provider>
    )
}

export {ViewContext}