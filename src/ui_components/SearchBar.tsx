import React, { useState } from "react"
import { UserProfile } from '@spotify/web-api-ts-sdk';
import UserLibrary from './SinglePageView';
// import { Button } from "@mui/material";

interface SearchProps{
    isSearching: boolean
    setIsSearching: React.Dispatch<React.SetStateAction<boolean>>
    stagingState: string
    setDisabledDashboard: (value: React.SetStateAction<boolean>) => void
    setActiveView:  React.Dispatch<React.SetStateAction<string[]>>
}

export default function SearchBar(props:SearchProps){

    const closeSearch = ()=>{
        props.setIsSearching(false)
        if(props.stagingState==="closed"){
            props.setActiveView(["dashboard"]); 
            props.setDisabledDashboard(false);
        }
    }
    

    return(
        <>
        {/* <div className="search-bar-container" style={props.isSearching?{backgroundColor:"#000000bd", width:"100%", left: props.stagingState==="open"?"50%":"0"}:{width:"0%", left: props.stagingState==="open"?"50%":"0"}}>
                

         </div> */}
        <div  className={"search-bar"} style={props.isSearching?{ width:"50%"}:{width:"0%"}}>
        <button onClick={closeSearch}>Close</button>
  
        </div>
    
        </>

    )
}