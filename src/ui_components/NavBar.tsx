import React, { useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import UserLibrary from './SinglePageView';
import { UserProfile } from "../../server/types";
// import { Button } from "@mui/material";

interface navProps{
    currentUser: UserProfile
}

export default function NavBar({currentUser}:navProps){
    const [activeView, setActiveView] = useState<string[]>(["dashboard"])
    const [disabledDashboard,setDisabledDashboard] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [stagingState, setStagingState] = useState<string>("closed")

    

    return(
        <div style={{overflow: 'clip'}}>
            <span style={{color: "rgb(135, 135, 135)"}}className="navbar">
                <h2>User Library</h2>
                <button disabled={disabledDashboard} onClick={()=>{setActiveView((prev)=>[prev.at(-2),prev.at(-1),"dashboard"])}}>Dashboard</button>
                <button onClick={()=>{setActiveView((prev)=>[prev.at(-2),prev.at(-1), "user playlists"]); stagingState==="open"?setIsSearching(false):setIsSearching(prev=>prev)}}>My Playlists</button>
                <button onClick={()=>{setActiveView((prev)=>[prev.at(-2), prev.at(-1), "liked playlists"]); stagingState==="open"?setIsSearching(false):setIsSearching(prev=>prev)}}>Liked Playlists</button>
                <button onClick={()=>{setActiveView((prev)=>[prev.at(-2),prev.at(-1),"liked albums"]); stagingState==="open"?setIsSearching(false):setIsSearching(prev=>prev)}}>Liked Albums</button>

                <p>Welcome, {currentUser.display_name}</p>
            </span>
            <UserLibrary stagingState={stagingState} setStagingState={setStagingState} isSearching={isSearching} setIsSearching={setIsSearching} activeView={activeView} currentUser={currentUser} setActiveView={setActiveView} setDisabledDashboard={setDisabledDashboard}></UserLibrary>
        </div>
    )
}