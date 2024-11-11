import React, { useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import UserLibrary from './SinglePageView';
import { UserProfile } from "../../server/types";
// import { Button } from "@mui/material";

interface navProps{
    currentUser: UserProfile
}
export type ActiveView = 'Dashboard'|"Liked Playlists"|"User Playlists"|"Liked Albums"

export default function NavBar({currentUser}:navProps){
    const [activeView, setActiveView] = useState<ActiveView[]>(["Dashboard"])
    const [disabledDashboard,setDisabledDashboard] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [stagingState, setStagingState] = useState<string>("closed")

    

    return(
        <div style={{overflow: 'clip'}}>
            <span style={{color: "rgb(135, 135, 135)"}}className="navbar">
                <h3>Mix Master</h3>
                <div style={{position: "absolute", left:"50%", transform: "translate(-50%, -50%)", top: "50%", height: "100%", alignItems: "end", width: "40%", display: "flex", justifyContent: "center", gap:"25px" }}>
                {/* <button style={{width:"calc(25% - 18.75px)", height: "70%"}} disabled={disabledDashboard} onClick={()=>{setActiveView((prev)=>[prev.at(-2),prev.at(-1),"Dashboard"])}}>Your Library</button> */}
                <button style={{width:"calc(25% - 18.75px)", height: "70%"}} onClick={()=>{setActiveView((prev)=>[prev.at(-2), prev.at(-1), "Liked Playlists"]); stagingState==="open"?setIsSearching(false):setIsSearching(prev=>prev)}}>Liked Playlists</button>
                <button style={{width:"calc(25% - 18.75px)", height: "70%"}} onClick={()=>{setActiveView((prev)=>[prev.at(-2),prev.at(-1), "User Playlists"]); stagingState==="open"?setIsSearching(false):setIsSearching(prev=>prev)}}>My Playlists</button>
                <button style={{width:"calc(25% - 18.75px)", height: "70%"}} onClick={()=>{setActiveView((prev)=>[prev.at(-2),prev.at(-1),"Liked Albums"]); stagingState==="open"?setIsSearching(false):setIsSearching(prev=>prev)}}>Liked Albums</button>
                </div>

                <p>Welcome, {currentUser.display_name}</p>
            </span>
            <UserLibrary stagingState={stagingState} setStagingState={setStagingState} isSearching={isSearching} setIsSearching={setIsSearching} activeView={activeView} currentUser={currentUser} setActiveView={setActiveView} setDisabledDashboard={setDisabledDashboard}></UserLibrary>
        </div>
    )
}