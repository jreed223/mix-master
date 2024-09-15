import React, { useState } from "react"
import { UserProfile } from '@spotify/web-api-ts-sdk';
import UserLibrary from './UserLibrary';

interface navProps{
    currentUser: UserProfile
}

export default function NavBar({currentUser}:navProps){

    return(
        <div>
            <span className="navbar">
                <h2>User Library</h2>
                <p>Welcome, {currentUser.display_name}</p>
            </span>
            <UserLibrary currentUser={currentUser}></UserLibrary>
        </div>
    )
}