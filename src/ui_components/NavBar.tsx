import React, { useContext } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import UserLibrary from './SinglePageView';
import { UserProfile } from "../../server/types";
import { NavigationContext } from "../state_management/NavigationProvider";
// import { Button } from "@mui/material";

interface navProps{
    currentUser: UserProfile
}
export type ViewName = 'Dashboard'|"Liked Playlists"|"User Playlists"|"Liked Albums"



export default function NavBar({currentUser}:navProps){
    // const [activeView, setActiveView] = useState<ViewName[]>(["Dashboard"])
    // const [,setDisabledDashboard] = useState(false)
    // const [isSearching, setIsSearching] = useState(false)
    // const [stagingState, setStagingState] = useState<string>("closed")

    const {setActiveView, activeView, setIsSearching, stagingState, setStagingState, isSearching} = useContext(NavigationContext)

    return(

            <div style={{overflow: 'clip'}}>
                <span style={{color: "rgb(135, 135, 135)", overflow:"clip"}}className="navbar">
                    <h2 style={{width:"calc(30%)",textAlign:"center", margin: 0, alignContent:"center",}} onClick={()=>{stagingState==="open"?setActiveView(prev=>isSearching?prev.at(-1)==="Dashboard"?["User Playlists"]:prev:["Dashboard"]):stagingState==="closed"&&activeView.at(-1)==="Dashboard"?setActiveView(["User Playlists"]):setActiveView(prev=>prev);setStagingState(stagingState==="open"?"closed":"open");}} >Mix Master</h2>
                    <div style={{position: "absolute", left:"50%", transform: "translate(-50%, -50%)", top: "50%", height: "100%", alignItems: "end", width: "40%", display: "flex", justifyContent: "center", gap:"25px" }}>
                    {/* <button style={{width:"calc(25% - 18.75px)", height: "70%"}} disabled={disabledDashboard} onClick={()=>{setActiveView((prev)=>[prev.at(-2),prev.at(-1),"Dashboard"])}}>Your Library</button> */}
                    <button disabled={activeView.at(-1)==="User Playlists"} style={{width:"calc(25% - 18.75px)", height: "70%"}} onClick={()=>{setActiveView((prev)=>[prev.at(-2),prev.at(-1), "User Playlists"]); stagingState==="open"?setIsSearching(false):setIsSearching(prev=>prev)}}>My Playlists</button>
                    <button disabled={activeView.at(-1)==="Liked Playlists"} style={{width:"calc(25% - 18.75px)", height: "70%"}} onClick={()=>{setActiveView((prev)=>[prev.at(-2), prev.at(-1), "Liked Playlists"]); stagingState==="open"?setIsSearching(false):setIsSearching(prev=>prev)}}>Liked Playlists</button>
                    <button disabled={activeView.at(-1)==="Liked Albums"} style={{width:"calc(25% - 18.75px)", height: "70%"}} onClick={()=>{setActiveView((prev)=>[prev.at(-2),prev.at(-1),"Liked Albums"]); stagingState==="open"?setIsSearching(false):setIsSearching(prev=>prev)}}>Liked Albums</button>
                    </div>
                    <p>Welcome, {currentUser.display_name}</p>
                </span>
                <UserLibrary  currentUser={currentUser} ></UserLibrary>
            </div>
    )
}

