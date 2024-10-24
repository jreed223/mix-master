import React, { useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import UserLibrary from './SinglePageView';
import { Album, Playlist, SearchResults, Track } from "../../server/types";
import ResultCard from "./ResultCard";
// import { Button } from "@mui/material";
import { albums } from '../../server/SpotifyData/controllers/libraryControllers/albums';
import TrackCollection from "../models/libraryItems";

interface SearchProps{
    isSearching: boolean
    setIsSearching: React.Dispatch<React.SetStateAction<boolean>>
    stagingState: string
    setStagingState:  React.Dispatch<React.SetStateAction<string>>

    setDisabledDashboard: (value: React.SetStateAction<boolean>) => void
    setActiveView:  React.Dispatch<React.SetStateAction<string[]>>
    searchQuery: string
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
    searchResults: SearchResults
    handleSearch: () => Promise<void>
    setStagedPlaylist: React.Dispatch<React.SetStateAction<Track[]>>
    stagedPlaylist: Track[]
    setSelectedLibraryItem: React.Dispatch<React.SetStateAction<TrackCollection>>

    
}


export default function SearchBar(props:SearchProps){

    const closeSearch = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault()
        props.setIsSearching(false)
        if(props.stagingState==="closed"){
            props.setActiveView(["dashboard"]); 
            props.setDisabledDashboard(false);
        }
    }

    const displayTracks = async (item: Playlist|Album['album'])=>{

        if(item.type==="album"){
            const albumObject: Album['album'] = await fetch("/spotify-data/album", {
                method: "POST",
                headers:{
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: item.id})
                // headers: {"id" : `${this.id}` }
        }).then(async (res)=>{
            const album = await res.json()
            return album
        })
                const tracklistClass = new TrackCollection(albumObject)
                props.setSelectedLibraryItem(tracklistClass)
                props.setStagingState('open')

            }else{

                const tracklistClass = new TrackCollection(item)
                props.setSelectedLibraryItem(tracklistClass)
                props.setStagingState('open')

            }

 
    }

  
    
    if(props.searchResults){
       const albumCards =  props.searchResults.albums.items.map((album)=>{
            return <ResultCard result={{
                type: "album",
                item: album,
                displayTracks: displayTracks
            }}></ResultCard>
        })

        const playlistCards =  props.searchResults.playlists.items.map((playlist)=>{
            return <ResultCard result={{
                type: "playlist",
                item: playlist,
                displayTracks: displayTracks
            }}></ResultCard>
        })

        const trackCards =  props.searchResults.tracks.items.map((track)=>{
            const draftTrack = (e)=>{
                e.preventDefault()
                    props.setStagedPlaylist(prev=>prev?prev.concat([track]):[track])
                    props.setStagingState("open")
            }
            const isDrafted = props.stagedPlaylist?.some(item=>item.id===track.id)
            return <ResultCard result={{
                type: "track",
                item: track,
                draftTrack: draftTrack,
                isDrafted: isDrafted
                // stagedPlaylist: props.stagedPlaylist,
                // setStagedPlaylist: props.setStagedPlaylist
            }}></ResultCard>
        })

        const artistCards =  props.searchResults.artists.items.map((artist)=>{
            return <ResultCard 
            
                result={{
                type: "artist",
                item: artist,

            }}></ResultCard>
        })
    
        const onEnter=(e:  React.KeyboardEvent<HTMLInputElement>)=>{
            if(e.key==="Enter"){
                e.preventDefault();
                props.handleSearch()
            }
        }

    return(
        <>
        {/* <div className="search-bar-container" style={props.isSearching?{backgroundColor:"#000000bd", width:"100%", left: props.stagingState==="open"?"50%":"0"}:{width:"0%", left: props.stagingState==="open"?"50%":"0"}}>
                

         </div> */}
        <div  className={"search-bar"} style={props.isSearching?{ height: "100%", width:"50%"}:{height: "100%", width:"0%"}}>
            <div style={{height:"40px"}}>
        <button  style={{paddingTop:"15px", paddingLeft: "15px"}} onKeyDown={(e)=>e.preventDefault()} onClick={(e)=>{closeSearch(e)}}>Close</button>
        <input type="text" placeholder="Search..." value={props.searchQuery} onKeyDown={(e)=>{onEnter(e)}} onChange={(e)=>{e.preventDefault();props.isSearching?props.setSearchQuery(e.target.value):props.setSearchQuery(prev=>prev)}}></input>
        </div>
        <div className="search-results" style={{ height:"calc(100% - 40px)", overflowY:"scroll"}}>
            
            {props.searchResults?
                <>
                {albumCards}
                {artistCards}
                {trackCards}
                {playlistCards}
                </>:<></>
            

            }
        </div>

        </div>
    
        </>

    )
}else{
    return(<>
            <div  className={"search-bar"} style={props.isSearching?{ width:"50%"}:{width:"0%"}}>
        <button  style={{marginTop:"15px", marginLeft: "15px"}} onClick={(e)=>closeSearch(e)}>Close</button>
        <input type="text" placeholder="Search..." value={props.searchQuery} onChange={(e)=>{props.isSearching?props.setSearchQuery(e.target.value):props.setSearchQuery(prev=>prev)}}></input>
        <div className="search-results">
            

        </div>

        </div>
    </>)
}
}