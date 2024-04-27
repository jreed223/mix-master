import React from "react"
import { UserProfile } from '@spotify/web-api-ts-sdk';

interface navProps{
    currentUser: UserProfile
}

export default function NavBar({currentUser}:navProps){
    return(
        <span className="navbar">
            <button className="create-buttons">New</button>
            <button className="create-buttons">Edit</button>
            <p>Welcome, {currentUser.display_name}</p>
        </span>
    )
}