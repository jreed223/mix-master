import { Suspense, useEffect, useRef, useState } from "react";
// import PlaylistCard, { PlaylistCardProps } from "./PlaylistCard";
import React from "react";
import { SearchResults, Track, UserProfile } from '../../server/types';

import TrackCollection from "../models/libraryItems";
import CircularProgress from '@mui/material/CircularProgress';
import { AlbumsComponent, LikedPlaylistsComponent, UserPlaylistsComponent } from "./UserLibrary/LibraryComponents";
import DraftingArea from "./DraftingPaneComponents/DraftingPane";
import SearchBar from "./SearchBar";
import { searchResults } from '../../server/SpotifyData/controllers/supplementalControllers/searchResults';
import TrackClass from "../models/Tracks";



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
    
    const [selectedLibraryItem, setSelectedLibraryItem] = useState<TrackCollection|null>(null)
    // const [stagingState, setStagingState] = useState<string|null>(null)



    const libraryContainer = useRef(null)
    const userItemsContainer = useRef(null)
    const likedItemsContainer = useRef(null)


    const displayTracks = (selection: TrackCollection, currentView: string)=>{
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

const [searchQuery, setSearchQuery] = useState()
const [searchResults, setSearchresults] = useState(null)
    const [stagedPlaylist, setStagedPlaylist] = useState<TrackClass[]>([])

type ResultTypes = SearchResults['albums']['items']|SearchResults['playlists']['items']|SearchResults['artists']['items']|SearchResults['tracks']['items']
const resultList=(resultsObject: SearchResults)=>{
    let fullItemList :ResultTypes[]= []
    // for(let type of Object.keys(searchResults)){
        
      fullItemList=  fullItemList.concat(resultsObject?.albums.items)
      fullItemList= fullItemList.concat(resultsObject?.artists.items)
      fullItemList= fullItemList.concat(resultsObject?.tracks.items)
      fullItemList= fullItemList.concat(resultsObject?.playlists.items)
    // }
    console.log("FILL ITEM LIST: ",fullItemList)
}

const handleSearch= async ()=>{
    // event.preventDefault()
    if(props.isSearching){

        const results = await fetch("/spotify-data/search-results", {
            method: "POST",
            headers:{
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({query: searchQuery})
            // headers: {"id" : `${this.id}` }
        })
        const newResults = await results.json()
        console.log(newResults)
        setSearchresults(newResults)
        resultList(newResults)

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
                <DraftingArea stagedPlaylist={stagedPlaylist} setStagedPlaylist={setStagedPlaylist} setIsSeraching={props.setIsSearching}setDisabledDashboard={props.setDisabledDashboard} isSearching={props.isSearching} selectedLibraryItem={selectedLibraryItem} setStagingState={props.setStagingState} stagingState={props.stagingState} setActiveView={props.setActiveView} activeView={props.activeView} ></DraftingArea>

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
                    <form style={{height:"100%"}}>
                    <SearchBar setSelectedLibraryItem={setSelectedLibraryItem} setStagingState={props.setStagingState} stagedPlaylist={stagedPlaylist} setStagedPlaylist={setStagedPlaylist} handleSearch={handleSearch} searchResults={searchResults} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setActiveView={props.setActiveView} setDisabledDashboard={props.setDisabledDashboard} stagingState={props.stagingState} setIsSearching={props.setIsSearching} isSearching={props.isSearching}></SearchBar>
                    <button style={{position: "absolute", right:"15px", top: "15px"}} type="submit" onClick={(e:React.MouseEvent<HTMLButtonElement>)=>{e.preventDefault();handleSearch(); }}>search</button>
                    </form>
            </div>)


}
