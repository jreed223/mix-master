import { Suspense, useEffect, useRef, useState } from "react";
// import PlaylistCard, { PlaylistCardProps } from "./PlaylistCard";
import React from "react";
import { UserProfile } from '../../server/types';

import Library from "../models/libraryItems";
import CircularProgress from '@mui/material/CircularProgress';
import { AlbumsComponent, LikedPlaylistsComponent, UserPlaylistsComponent } from "./UserLibrary/LibraryComponents";
import DraftingArea from "./DraftingPaneComponents/DraftingPane";
import SearchBar from "./SearchBar";



interface UserLibraryProps{
    currentUser: UserProfile
    activeView: string[]
    setActiveView:React.Dispatch<React.SetStateAction<string[]>>
    setDisabledDashboard: React.Dispatch<React.SetStateAction<boolean>>
    isSearching: boolean
    setIsSearching: React.Dispatch<React.SetStateAction<boolean>>
    stagingState: string
    setStagingState: React.Dispatch<React.SetStateAction<string>>
}

export default function UserLibrary(props:UserLibraryProps){
    
    const [selectedLibraryItem, setSelectedLibraryItem] = useState<Library|null>(null)
    // const [stagingState, setStagingState] = useState<string|null>(null)



    const libraryContainer = useRef(null)
    const userItemsContainer = useRef(null)
    const likedItemsContainer = useRef(null)


    const displayTracks = (selection: Library, currentView: string)=>{
        props.setStagingState("open")
        props.setActiveView([currentView])
        props.setDisabledDashboard(true)
        if(selection.id !== selectedLibraryItem?.id){
            setSelectedLibraryItem(selection)
        }
    }


const [userPlaylistsStyle, setUserPlaylistsStyle] = useState({})
const [likedPlaylistsStyle, setLikedPlaylistsStyle] = useState({})
// useEffect(()=>{
//     if(stagingState==="closed"){
//         props.setDisabledDashboard(false)


//     }
// }, [props, stagingState])
// const [isSeaching, setIsSearching]=useState(false)

useEffect(()=>{

console.log("ACTIVE VIEW RAN!!!")

    

        switch(props.activeView.at(-1)){
            case "dashboard":
                setLikedPlaylistsStyle({
                    width: "50%",
                    
                    transition: "1s"
                })
                setUserPlaylistsStyle(   {
                    width: "50%",
                    // paddingRight: "25px",
                    transition: "1s"
                })
                break;                
            case "user playlists":
                // setIsSeaching(false)
                    if(!props.isSearching){
                        setLikedPlaylistsStyle({
                            width: "0%",
    
                            transition: "1s"
                        })
                    }

                    setUserPlaylistsStyle({
                        width: "100%",
                        //paddingRight: "25px",
                        transition: "1s"
                    })
                // }
                break;
            case "liked playlists":
                // if(stagingState==="open"){
                //     setIsSearching(false)

                // }

                setLikedPlaylistsStyle({
                    width: "100%",

                    transition: "1s"
                })
                setUserPlaylistsStyle({
                    width: "0%",

                    transition: "1s"
                })
                break;
            case "liked albums":
                // if(stagingState==="open"){
                //     setIsSearching(false)

                // }

                setLikedPlaylistsStyle({
                    width: "100%",

                    transition: "1s"
                })
                setUserPlaylistsStyle({
                    width: "0%",
                    
                    transition: "1s"
                })
                break;
        
        }


}, [props.isSearching, props.activeView])


const handleSearch=()=>{
    if(props.isSearching){

    }else{
        props.setIsSearching(true)
        props.setDisabledDashboard(true)
        if(props.activeView.at(-1)==="dashboard"){
            props.setActiveView(["user playlists"])
            
        }
    }
}

// const currentGap = props.activeView.at(-1)==="dashboard"||props.activeView.at(-1)==="user playlists"?"25px": "0px"

        return (
            <div className="main-content-area" style={{position: "relative"}}>
                <DraftingArea setIsSeraching={props.setIsSearching}setDisabledDashboard={props.setDisabledDashboard} isSearching={props.isSearching} selectedLibraryItem={selectedLibraryItem} setStagingState={props.setStagingState} stagingState={props.stagingState} setActiveView={props.setActiveView} activeView={props.activeView} ></DraftingArea>

                    <div ref={libraryContainer} style={{flexGrow:1}} className="library-container" id="library-container">
                            
                            <div ref={userItemsContainer} className="user-library-items" style={userPlaylistsStyle}>
                            <Suspense fallback={<CircularProgress/>}>
                                <UserPlaylistsComponent setIsSearching={props.setIsSearching} isSearching={props.isSearching} stagingState={props.stagingState}activeView={props.activeView} userId={props.currentUser.id} onPlaylistSelection={displayTracks} selectedLibraryItemId={selectedLibraryItem?.id}></UserPlaylistsComponent>
                            </Suspense>
                            </div>
                            <div ref={likedItemsContainer} className="liked-library-items" style={likedPlaylistsStyle}>
                            <Suspense fallback={<CircularProgress/>}>
                                <LikedPlaylistsComponent setIsSearching={props.setIsSearching} isSearching={props.isSearching} stagingState={props.stagingState} activeView={props.activeView} userId={props.currentUser.id} onPlaylistSelection={displayTracks} selectedLibraryItemId={selectedLibraryItem?.id}></LikedPlaylistsComponent>
                            </Suspense>
                            <Suspense fallback={<CircularProgress/>}>
                                <AlbumsComponent setIsSearching={props.setIsSearching} isSearching={props.isSearching} stagingState={props.stagingState} activeView={props.activeView} userId={props.currentUser.id} onPlaylistSelection={displayTracks} selectedLibraryItemId={selectedLibraryItem?.id}></AlbumsComponent>
                            </Suspense>
                            </div>

                    </div>
                    <SearchBar setActiveView={props.setActiveView} setDisabledDashboard={props.setDisabledDashboard} stagingState={props.stagingState} setIsSearching={props.setIsSearching} isSearching={props.isSearching}></SearchBar>
                    <button style={{position: "absolute", right:"15px", top: "15px"}} onClick={()=>{handleSearch(); }}>search</button>
            </div>)


}
