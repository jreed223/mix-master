import React, { createContext, useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
// import { Button } from "@mui/material";


export type ViewName = 'Dashboard'|"Liked Playlists"|"User Playlists"|"Liked Albums"

    const NavigationContext = createContext(null)


export default function NavigationProvider({children}){
    const [activeView, setActiveView] = useState<ViewName[]>(["Dashboard"])
    const [primaryView, setPrimaryView] = useState<ViewName>("User Playlists")

    // const [disabledDashboard,setDisabledDashboard] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [stagingState, setStagingState] = useState<string>("closed")


    return(
        <NavigationContext.Provider value={{activeView, setActiveView, isSearching, setIsSearching, stagingState, setStagingState, primaryView, setPrimaryView}}>
            {children}
        </NavigationContext.Provider>
    )
}

export {NavigationContext}