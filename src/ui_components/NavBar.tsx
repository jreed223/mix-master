import React, { useState } from "react"
import { UserProfile } from '@spotify/web-api-ts-sdk';
import UserLibrary from './UserLibrary';
import { Button } from "@mui/material";

interface navProps{
    currentUser: UserProfile
}

export default function NavBar({currentUser}:navProps){
    const [activeView, setActiveView] = useState<string[]>(["dashboard"])

    return(
        <div>
            <span className="navbar">
                <h2>User Library</h2>
                <button onClick={()=>{setActiveView((prev)=>prev.at(-1)!=="dashboard"?[prev.at(-2),prev.at(-1),"dashboard"]:activeView)}}>Dashboard</button>
                <button onClick={()=>{setActiveView((prev)=>prev.at(-1)!=="user playlists"?[prev.at(-2),prev.at(-1), "user playlists"]:activeView)}}>My Playlists</button>
                <button onClick={()=>{setActiveView((prev)=>prev.at(-1)!=="liked playlists"?[prev.at(-2), prev.at(-1), "liked playlists"]:activeView)}}>Liked Playlists</button>
                <button onClick={()=>{setActiveView((prev)=>prev.at(-1)!=="liked albums"?[prev.at(-2),prev.at(-1),"liked albums"]:activeView)}}>Liked Albums</button>

                <p>Welcome, {currentUser.display_name}</p>
            </span>
            <UserLibrary activeView={activeView} currentUser={currentUser}></UserLibrary>
        </div>
    )
}