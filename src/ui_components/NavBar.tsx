import React, { useState } from "react"
import { UserProfile } from '@spotify/web-api-ts-sdk';
import UserLibrary from "./UserLibrary";

interface navProps{
    currentUser: UserProfile
}

export default function NavBar({currentUser}:navProps){
    const [stagingState, setStatgingState] = useState<String|null>(null)

    function toggleStagingNew(){
        if(stagingState==="new"){
            setStatgingState(null)
            let creationContainer = document.getElementById("creation-container")
            let libraryContainer = document.getElementById("library-container")
            let draftingDiv = document.getElementById("drafting-div")
            let searchFilterDiv = document.getElementById("search-filter-div")
            creationContainer.style.animation = "shrink-staging 1s"
            libraryContainer.style.animation = "grow-library 1s"
            // draftingDiv.style.animation = "shrink-staging 1s"
            // searchFilterDiv.style.animation = "shrink-staging 1s"


        }else{
            setStatgingState("new")
            let creationContainer = document.getElementById("creation-container")
            let libraryContainer = document.getElementById("library-container")
            let draftingDiv = document.getElementById("drafting-div")
            let searchFilterDiv = document.getElementById("search-filter-div")
            creationContainer.style.animation = "grow-staging 1s"
            libraryContainer.style.animation = "shrink-library 1s"
            // draftingDiv.style.animation = "grow-staging 1s"
            // searchFilterDiv.style.animation = "grow-staging 1s"

        }
    }
    function toggleStagingEdit(){
        if(stagingState==="edit"){
            setStatgingState(null)
        }else{
            setStatgingState("edit")
        }
    }

    return(
        <div>
            <span className="navbar">
                <button className="create-buttons" onClick={toggleStagingNew}>New</button>
                <button className="create-buttons" onClick={toggleStagingEdit}>Edit</button>
                <p>Welcome, {currentUser.display_name}</p>
            </span>
            <UserLibrary stagingState={stagingState}></UserLibrary>
        </div>
    )
}