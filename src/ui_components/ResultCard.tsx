import React, { useEffect, useState } from "react";
import { relative } from 'path';
import { Album, Artist, Playlist, SearchResults, Track } from "../../server/types";
import { searchResults } from '../../server/SpotifyData/controllers/supplementalControllers/searchResults';
import TrackCollection from "../models/libraryItems";

type TrackResult = {
    type: "track"
    item: Track
    draftTrack:  (e: any) => void
    isDrafted: boolean
}

type AlbumResult ={
    type: "album"
    item: Album['album']
    displayTracks: (item: Playlist | Album["album"]) => void
}

type PlaylistResult ={
    type: "playlist"
    item: Playlist
    displayTracks: (item: Playlist | Album["album"]) => void
}

type ArtistResult ={
    
    type: "artist"
    item: Artist
        
}

export interface ResultCardProps{
    result:AlbumResult|TrackResult|PlaylistResult|ArtistResult

                
    // searchResults: 
}

const ResultCard: React.FC<ResultCardProps> = (props: ResultCardProps)=>{




switch(props.result.type){
    case("album"):
    const albumProps = props.result as AlbumResult

        console.log(props.result.item)
        
    
        return(
            <div style={{display: "flex"}}className="track-card">
            <div  style={{display: "inline-flex", position: "relative",height: "100%", aspectRatio: "1 / 1"}}>
            <img style={{position:"relative", height: "100%", aspectRatio: "1 / 1"}}src={props.result.item?.images[0]?.url}alt={`${props.result.item.name} cover`}></img>
            <div onClick={()=>albumProps.displayTracks(albumProps.item)} style={{top:0, left:0,width:"100%", height:"100%", position:"absolute"}}></div>
            </div>
             <p style={{display:'inline'}} className={"track-card-text"}>Album: {props.result?.item?.name}</p>
            
            </div>
        )
        ;
    case("artist"):
    
    
        return(
            <div style={{display: "flex"}} className="track-card">
            <div  style={{display: "inline-flex", position: "relative",height: "100%", aspectRatio: "1 / 1"}}>
            <img style={{borderRadius:"50%",position:"relative", height: "100%", aspectRatio: "1 / 1"}}src={props.result.item?.images[0]?.url}alt={`${props.result.item.name} cover`}></img>
            {/* <div onClick={()=>playPreviewAudio(track.preview_url)} style={{color: !previewState?"inherit":previewState,top:0, left:0,width:"100%", height:"100%", position:"absolute"}}>preview</div> */}
            </div>
            <p style={{display:'inline'}} className={"track-card-text"}>Artist: {props.result?.item?.name}</p>
        
        </div>
    )
        
    ;

    case("playlist"):
    const playlistProps = props.result as PlaylistResult


    
        return(
            <div style={{display: "flex"}} className="track-card" >
            <div style={{display: "inline-flex", position: "relative",height: "100%", aspectRatio: "1 / 1"}}>
            <img style={{position:"relative", height: "100%", aspectRatio: "1 / 1"}}src={props.result.item?.images[0]?.url}alt={`${props.result.item.name} cover`}></img>
            <div onClick={()=>playlistProps.displayTracks(playlistProps.item)} style={{top:0, left:0,width:"100%", height:"100%", position:"absolute"}}></div>
            </div>
            <p style={{display:'inline'}} className={"track-card-text"}>Playlist: {props.result?.item?.name}</p>
            </div>
        )
    case("track"):
    const trackProps = props.result as TrackResult

        // const isDrafted = trackProps.stagedPlaylist?.some(item=>item.id===trackProps.item.id)
        // const draftTrack=(e)=>{
        //     e.preventDefault()
        //     trackProps.setStagedPlaylist(prev=>prev?prev.concat([trackProps.item]):[trackProps.item])
        // }
    
        return(
            <div style={{display: "flex"}} className="track-card" >
            <div style={{display: "inline-flex", position: "relative",height: "100%", aspectRatio: "1 / 1"}}>
            <img style={{position:"relative", height: "100%", aspectRatio: "1 / 1"}} src={props.result.item?.album?.images[0].url}alt={`${props.result.item.name} cover`}></img>
            {/* <div onClick={()=>playPreviewAudio(track.preview_url)} style={{color: !previewState?"inherit":previewState,top:0, left:0,width:"100%", height:"100%", position:"absolute"}}>preview</div> */}
            </div>
            <p style={{display:'inline'}}className={"track-card-text"}>Track: {trackProps.item?.name}</p>
            <button disabled={trackProps.isDrafted} onClick={(e)=>trackProps.draftTrack(e)}></button>

            </div>
        )

}
    



}

export default ResultCard


