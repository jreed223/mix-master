import React, { useContext, useEffect, useState } from "react";
import { Album, Artist, Playlist, SearchResults } from "../../../../server/types";
import TrackClass from '../../../models/Tracks';
import { ViewContext } from "../../../state_management/ViewProvider";
import { DraftingContext } from "../../../state_management/DraftingPaneProvider";
import { Hidden } from "@mui/material";
import { ArtistProfileProps, UserProfileProps } from "./ProfileView";
import TrackCollection from "../../../models/libraryItems";

type TrackResult = {
    type: "track"
    item: TrackClass
    draftTrack: (e: any, trackClass: TrackClass) => void
    isDrafted: (trackId: string) => boolean
}

type AlbumResult = {
    type: "album"
    item: Album['album']
    displayTracks: (item: Playlist | Album["album"]|TrackCollection) => void
}

type PlaylistResult = {
    type: "playlist"
    item: Playlist
    displayTracks: (item: Playlist | Album["album"]|TrackCollection) => void
}

type ArtistResult = {
    type: "artist"
    item: Artist
    displayTracks: (item: Playlist | Album["album"]|TrackCollection) => void
    draftTrack: (e: any, trackClass: TrackClass) => void
    isDrafted: (trackId: string) => boolean
    expandedArtistId: string
    setExpandedArtistId: React.Dispatch<React.SetStateAction<string>>
}

export interface ResultCardProps {
    result: AlbumResult | TrackResult | PlaylistResult | ArtistResult
    popularity: number | null
 


    // searchResults: 
}

const ResultCard: React.FC<ResultCardProps> = (props: ResultCardProps) => {
    

    const [artistAlbums, setArtistAlbums] = useState<SearchResults['albums']>(null)
    const [artistAlbumsCards, setArtistAlbumsCards] = useState<React.JSX.Element[]>(null)
    const [expanded, setExpanded] = useState(false)

    const { isMobile, setSelectedProfile, setDisplayProfile} = useContext(ViewContext)
    const {stagingState, setStagingState, selectedLibraryItem} = useContext(DraftingContext)

    const albumProps = props.result as AlbumResult
    const artistProps = props.result as ArtistResult
    const playlistProps = props.result as PlaylistResult



    useEffect(() => {
        if (artistAlbums) {
            const artistAlbumResults = artistAlbums.items.map((album) => {

                return <ResultCard

                    popularity={null}
                    result={{
                        type: "album",
                        item: album,
                        displayTracks: artistProps.displayTracks
                    }}></ResultCard>
                // }
            })


            setArtistAlbumsCards(artistAlbumResults)
        }
    }, [artistAlbums, artistProps.displayTracks, artistProps.draftTrack, artistProps.isDrafted])


    if(props.result.type==="album"||props.result.type==="playlist"){
        return (
            <div style={{position: "relative", display: "flex", width: "calc(50% - 20px)", height: isMobile?"8vh":"12vh",  minHeight:isMobile?'unset':'80px',}} className="track-card">
                <div style={{ display: "inline-flex", position: "relative", height: "100%", aspectRatio: "1 / 1" }}>
                    <img onClick={selectedLibraryItem?.id!==props.result?.item.id?() =>{  props.result.type==="album"?albumProps.displayTracks(albumProps.item):playlistProps.displayTracks(playlistProps.item)}:stagingState==="closed"?()=>{setStagingState("open")}:()=>{}} loading="lazy" style={{cursor: (selectedLibraryItem?.id!==props.result?.item.id||stagingState==='closed')?'pointer':'default', position: "relative", height: "100%", aspectRatio: "1 / 1" }} src={props.result.item?.images?.at(0)?.url} alt={`${props.result.item?.name||"Unknown"} cover`}></img>
                    {/* <div style={{margin:"auto"}}>
                    <p style={{ margin:"0" }} className={"track-card-text"}>{props.result?.item?.name||"Unknown"}</p>
                    <p style={{margin:"0" }} className={"track-card-text"}>{props.result?.item?.artists.at(0).name||"Unknown"}</p>
                    </div> */}

                </div>
                <div onClick={ selectedLibraryItem?.id!==props.result?.item.id?()=>{ props.result.type==="album"? albumProps.displayTracks(albumProps.item):playlistProps.displayTracks(playlistProps.item)}:stagingState==="closed"?()=>{setStagingState("open")}:()=>{}} className={""}style={{marginLeft:"7px",cursor: (selectedLibraryItem?.id!==props.result?.item.id||stagingState==='closed')?'pointer':'default',position: "relative", display:"flex", flexDirection:"column",  overflow: 'hidden', flexGrow: '1', width: "0%", height:"100%", justifyContent:'center'}}>
                    
                    <p style={{ margin:"0", color: selectedLibraryItem?.id===props.result?.item.id?"rgb(135, 135, 135, 0.35)":"inherit" }} className={"track-card-text"}>{props.result?.item?.name||"Unknown"}</p>
                    <div style={{width: "min-content", textWrap:'nowrap', maxWidth: "100%", overflow:'hidden'}} className="">
                    <p onClick={(e)=>{e.stopPropagation(); setDisplayProfile(true); setSelectedProfile(props.result.type==="album"?{type: 'artist', profileId: albumProps.item.artists.at(0).id}:{type:"user", profileId:playlistProps.item.owner.id} as UserProfileProps)}} style={{cursor:'pointer', margin:"0", color: selectedLibraryItem?.id===props.result?.item.id?"rgb(135, 135, 135, 0.35)":"inherit" }} className={"track-card-text artist-text"}>{props.result.type==="album"?albumProps.item?.artists?.at(0).name||"Unknown":playlistProps?.item?.owner?.display_name}</p>

                    </div>

                </div>
                {/* <div onClick={() =>{  albumProps.displayTracks(albumProps.item)}} style={{cursor: "pointer", backgroundColor:'black', opacity:selectedLibraryItem?.id===albumProps.item.id?".5":"0", top: 0, left: 0, width: "100%", height: "100%", position: "absolute" }}>
                    


                </div> */}
         </div>
        )

    }else if(props.result.type==="artist"){
        const displayAlbums = async () => {
            console.log(artistProps.item.id)
            if (artistAlbums) {
                artistProps.setExpandedArtistId(artistProps.item.id)

                setExpanded(prev => !prev)
            } else {
                artistProps.setExpandedArtistId(artistProps.item.id)
                setExpanded(true)

                const albumsObject: SearchResults['albums'] = await fetch("/spotify-data/artistAlbums", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: artistProps.item.id })
                    // headers: {"id" : `${this.id}` }
                }).then(async (res) => {
                    const albums = await res.json()
                    return albums
                })

                console.log(albumsObject)
                setArtistAlbums(albumsObject)

            }
        }


        return (
            <>
            <div style={{height:"calc(100% - 100px)",background: "#141414", transition: expanded?'width 1s':"none", width: isMobile?"100%":stagingState==="open"?"calc(50%)":"calc(75%)", overflowY: 'hidden', display:"flex", flexDirection:'column' }}>
                <div onClick={() => {setDisplayProfile(true); setSelectedProfile({type: 'artist', profileId: artistProps.item.id})}} style={{ cursor: "pointer", display: "flex", margin: 0, padding: "5px", height: isMobile?"8vh":"12vh",  minHeight:isMobile?'unset':'80px'}} className="track-card">
                    <div style={{  display: "inline-flex", position: "relative", height: "100%", aspectRatio: "1 / 1" }}>
                        <img loading="lazy" style={{ borderRadius: "50%", position: "relative", height: "100%", aspectRatio: "1 / 1" }} src={props.result.item?.images[0]?.url} alt={`${props.result.item?.name||"Unknown"} cover`}></img>
                        <div  style={{ top: 0, left: 0, width: "100%", height: "100%", position: "absolute" }}></div>
                    </div>
                    <p style={{ display: 'inline', margin:'auto 7px' }} className={"track-card-text "}>{props.result?.item?.name||"Unknown"}</p>
                  
    
                </div>
                {/* <div style={{ alignContent:'baseline',justifyContent: 'center', flexFlow:"row wrap", display: (artistProps.expandedArtistId===albumProps.item.id) && expanded?"flex":"none", width:(artistProps.expandedArtistId===albumProps.item.id) && expanded?"100%":"50%", flex:'1' ,   background: "rgb(33 33 33)", overflowY:'auto', transition:expanded?"1s": "unset",  zIndex:artistProps.expandedArtistId===albumProps.item.id? 1000 : 'unset' }}>
               {artistAlbumsCards}
           </div> */}

            </div>

           </>
        )
    }





    // switch (props.result.type) {

    //     case ("album"):

    //         console.log(props.result.item)
    //         // const albumProps = props.result as AlbumResult



    //         return (
    //             <div style={{position: "relative", display: "flex", width: "calc(50% - 20px)", minHeight: "80px", height: "10vh",}} className="track-card">
    //                 <div style={{ display: "inline-flex", position: "relative", height: "100%", aspectRatio: "1 / 1" }}>
    //                     <img onClick={selectedLibraryItem?.id!==albumProps.item.id?() =>{  albumProps.displayTracks(albumProps.item)}:()=>{}} loading="lazy" style={{cursor: selectedLibraryItem?.id!==albumProps.item.id?'pointer':'default', position: "relative", height: "100%", aspectRatio: "1 / 1" }} src={props.result.item?.images[0]?.url} alt={`${props.result.item?.name||"Unknown"} cover`}></img>
    //                     {/* <div style={{margin:"auto"}}>
    //                     <p style={{ margin:"0" }} className={"track-card-text"}>{props.result?.item?.name||"Unknown"}</p>
    //                     <p style={{margin:"0" }} className={"track-card-text"}>{props.result?.item?.artists.at(0).name||"Unknown"}</p>
    //                     </div> */}

    //                 </div>
    //                 <div onClick={ selectedLibraryItem?.id!==albumProps.item.id?()=>{  albumProps.displayTracks(albumProps.item)}:()=>{}} className={""}style={{cursor: selectedLibraryItem?.id!==albumProps.item.id?'pointer':'default',position: "relative", display:"flex", flexDirection:"column",  overflow: 'hidden', flexGrow: '1', width: "0%", height:"100%", justifyContent:'center'}}>
                        
    //                     <p style={{ margin:"0", color: selectedLibraryItem?.id===albumProps.item.id?"rgb(135, 135, 135, 0.35)":"inherit" }} className={"track-card-text"}>{props.result?.item?.name||"Unknown"}</p>
    //                     <div style={{width: "min-content", textWrap:'nowrap', maxWidth: "100%", overflow:'hidden'}} className="">
    //                     <p onClick={(e)=>{e.stopPropagation()}} style={{cursor:'pointer', margin:"0", color: selectedLibraryItem?.id===albumProps.item.id?"rgb(135, 135, 135, 0.35)":"inherit" }} className={"track-card-text artist-text"}>{props.result?.item?.artists.at(0).name||"Unknown"}</p>

    //                     </div>

    //                 </div>
    //                 {/* <div onClick={() =>{  albumProps.displayTracks(albumProps.item)}} style={{cursor: "pointer", backgroundColor:'black', opacity:selectedLibraryItem?.id===albumProps.item.id?".5":"0", top: 0, left: 0, width: "100%", height: "100%", position: "absolute" }}>
                        


    //                 </div> */}
    //          </div>
    //         )
    //             ;
    //     case ("artist"):


    //         const displayAlbums = async () => {
    //             console.log(artistProps.item.id)
    //             if (artistAlbums) {
    //                 artistProps.setExpandedArtistId(artistProps.item.id)

    //                 setExpanded(prev => !prev)
    //             } else {
    //                 artistProps.setExpandedArtistId(artistProps.item.id)
    //                 setExpanded(true)

    //                 const albumsObject: SearchResults['albums'] = await fetch("/spotify-data/artistAlbums", {
    //                     method: "POST",
    //                     headers: {
    //                         'Content-Type': 'application/json'
    //                     },
    //                     body: JSON.stringify({ id: artistProps.item.id })
    //                     // headers: {"id" : `${this.id}` }
    //                 }).then(async (res) => {
    //                     const albums = await res.json()
    //                     return albums
    //                 })

    //                 console.log(albumsObject)
    //                 setArtistAlbums(albumsObject)

    //             }
    //         }


    //         return (
    //             <>
    //             <div style={{ maxWidth:expanded?'100vw':'450px',height:"calc(100% - 100px)",background: "#141414", transition: expanded?'width 1s':"none", width: expanded?isMobile?"100%":stagingState==="open"?"calc(50%)":"calc(75%)":"50%", minHeight: "80px", position:expanded?'fixed':'relative', top:expanded?'100px':'0px', zIndex:artistProps.expandedArtistId===albumProps.item.id? 1000 : 'unset', overflowY: 'hidden', display:"flex", flexDirection:'column' }}>
    //                 <div onClick={() => displayAlbums()} style={{ cursor: "pointer", display: "flex", margin: 0, padding: "5px", height: (artistProps.expandedArtistId===albumProps.item.id) && expanded?"7vh":"10vh"}} className="track-card">
    //                     <div style={{  display: "inline-flex", position: "relative", height: "100%", aspectRatio: "1 / 1" }}>
    //                         <img loading="lazy" style={{ borderRadius: "50%", position: "relative", height: "100%", aspectRatio: "1 / 1" }} src={props.result.item?.images[0]?.url} alt={`${props.result.item?.name||"Unknown"} cover`}></img>
    //                         <div  style={{ top: 0, left: 0, width: "100%", height: "100%", position: "absolute" }}></div>
    //                     </div>
    //                     <p style={{ display: 'inline' }} className={"track-card-text "}>{props.result?.item?.name||"Unknown"}</p>
                      
        
    //                 </div>
    //                 <div style={{ flexFlow:"row wrap", display: (artistProps.expandedArtistId===albumProps.item.id) && expanded?"flex":"none", width:(artistProps.expandedArtistId===albumProps.item.id) && expanded?"100%":"50%", flex:'1' ,   background: "rgb(33 33 33)", overflowY:'auto', transition:expanded?"1s": "unset",  zIndex:artistProps.expandedArtistId===albumProps.item.id? 1000 : 'unset' }}>
    //                {artistAlbumsCards}
    //            </div>
   
    //             </div>
  
    //            </>
    //         )

    //             ;

    //     case ("playlist"):



    //         return (
    //             <div style={{position:'relative', display: "flex", width: "calc(50% - 20px)", height: "10vh" }} className="track-card" >
    //                 <div style={{ display: "inline-flex", position: "relative", height: "100%", aspectRatio: "1 / 1" }}>
    //                     <img loading="lazy" style={{ position: "relative", height: "100%", aspectRatio: "1 / 1" }} src={playlistProps.item?.images[0]?.url} alt={`${playlistProps.item?.name||"unknown"} cover`}></img>
    //                 </div>
    //                 <p style={{ display: 'inline' }} className={"track-card-text"}>{playlistProps.item?.name||"Untitled"}</p>
    //                 <div onClick={() =>{ playlistProps.displayTracks(playlistProps.item)}} style={{cursor: "pointer", backgroundColor:'black', opacity:selectedLibraryItem?.id===playlistProps.item.id?".5":"0", top: 0, left: 0, width: "100%", height: "100%", position: "absolute" }}></div>

    //             </div>
    //         )
    //     case ("track"):
    //         const trackProps = props.result as TrackResult

    //         return (
    //             <div style={{ display: "flex", width: "50%", minHeight: "80px", height: "10vh" }} className="track-card" >
    //                 <div style={{ display: "inline-flex", position: "relative", height: "100%", aspectRatio: "1 / 1" }}>

    //                     <img loading="lazy" style={{ position: "relative", height: "100%", aspectRatio: "1 / 1" }} src={props.result.item?.track.album?.images[0].url} alt={`${props.result.item.track.name} cover`}></img>
    //                     {/* <div onClick={()=>playPreviewAudio(track.preview_url)} style={{color: !previewState?"inherit":previewState,top:0, left:0,width:"100%", height:"100%", position:"absolute"}}>preview</div> */}
    //                 </div>
    //                 <p style={{ display: 'inline' }} className={"track-card-text"}> {trackProps.item?.track?.name||"Unknown"}</p>
    //                 <button style={{width:"40px", height: "100%", borderRadius: "10%"}} disabled={trackProps.isDrafted(trackProps.item.track.id)} onClick={(e) => {e.preventDefault(); trackProps.draftTrack(e, trackProps.item)}}>+</button>


    //             </div>
    //         )

    // }




}

export default ResultCard


