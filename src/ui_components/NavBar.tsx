import React, { useState } from "react"
import { UserProfile } from '@spotify/web-api-ts-sdk';
import UserLibrary from './SinglePageView';
// import { Button } from "@mui/material";

interface navProps{
    currentUser: UserProfile
}

export default function NavBar({currentUser}:navProps){
    const [activeView, setActiveView] = useState<string[]>(["dashboard"])
    const [disabledDashboard,setDisabledDashboard] = useState(false)


    return(
        <div>
            <span style={{color: "rgb(135, 135, 135)"}}className="navbar">
                <h2>User Library</h2>
                <button disabled={disabledDashboard} onClick={()=>{setActiveView((prev)=>prev.at(-1)!=="dashboard"?[prev.at(-2),prev.at(-1),"dashboard"]:activeView)}}>Dashboard</button>
                <button onClick={()=>{setActiveView((prev)=>prev.at(-1)!=="user playlists"?[prev.at(-2),prev.at(-1), "user playlists"]:activeView)}}>My Playlists</button>
                <button onClick={()=>{setActiveView((prev)=>prev.at(-1)!=="liked playlists"?[prev.at(-2), prev.at(-1), "liked playlists"]:activeView)}}>Liked Playlists</button>
                <button onClick={()=>{setActiveView((prev)=>prev.at(-1)!=="liked albums"?[prev.at(-2),prev.at(-1),"liked albums"]:activeView)}}>Liked Albums</button>

                <p>Welcome, {currentUser.display_name}</p>
            </span>
            <UserLibrary activeView={activeView} currentUser={currentUser} setActiveView={setActiveView} setDisabledDashboard={setDisabledDashboard}></UserLibrary>
        </div>
    )
}