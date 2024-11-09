import React, { useEffect, useState } from "react";
import { relative } from 'path';
import { Album, Artist, Playlist, SearchResults, Track } from "../../server/types";
import { searchResults } from '../../server/SpotifyData/controllers/supplementalControllers/searchResults';
import TrackCollection from "../models/libraryItems";
import TrackClass from '../models/Tracks';
import { albums } from '../../server/SpotifyData/controllers/libraryControllers/albums';

type TrackResult = {
    type: "track"
    item: TrackClass
    draftTrack: (e: any, trackClass: TrackClass) => void
    isDrafted: (trackId: string) => boolean
}

type AlbumResult = {
    type: "album"
    item: Album['album']
    displayTracks: (item: Playlist | Album["album"]) => void
}

type PlaylistResult = {
    type: "playlist"
    item: Playlist
    displayTracks: (item: Playlist | Album["album"]) => void
}

type ArtistResult = {
    type: "artist"
    item: Artist
    displayTracks: (item: Playlist | Album["album"]) => void
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

    const albumProps = props.result as AlbumResult
    const artistProps = props.result as ArtistResult


    useEffect(() => {
        if (artistAlbums) {
            const artistAlbumResults = artistAlbums.items.map((album) => {
                // if(album.album_type==="single"){
                //     const track = new TrackClass(album.tracks.items[0])
                //     return <ResultCard result={{
                //         type: "track",
                //         item: track,
                //         draftTrack: artistProps.draftTrack,
                //         isDrafted: artistProps.isDrafted
                //     }}></ResultCard>

                // }else{
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





    switch (props.result.type) {

        case ("album"):

            console.log(props.result.item)


            return (
                <div style={{ display: "flex", width: "50%", height: "80px" }} className="track-card">
                    <div style={{ display: "inline-flex", position: "relative", height: "100%", aspectRatio: "1 / 1" }}>
                        <img loading="lazy" style={{ position: "relative", height: "100%", aspectRatio: "1 / 1" }} src={props.result.item?.images[0]?.url} alt={`${props.result.item.name} cover`}></img>
                        <div onClick={() => albumProps.displayTracks(albumProps.item)} style={{ top: 0, left: 0, width: "100%", height: "100%", position: "absolute" }}></div>
                    </div>
                    <p style={{ display: 'inline' }} className={"track-card-text"}>Album: {props.result?.item?.name}</p>

                </div>
            )
                ;
        case ("artist"):


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
                    // const artistAlbumResults = albumsObject.items.map((album)=>{
                    //     return <ResultCard result={{
                    //         type: "album",
                    //         item: album,
                    //         displayTracks: albumProps.displayTracks
                    //     }}></ResultCard>
                    // })
                    console.log(albumsObject)
                    setArtistAlbums(albumsObject)
                    // console.log('TRACKLIST CLASS: ',tracklistClass)
                    // props.setSelectedLibraryItem(tracklistClass)
                    // props.setStagingState('open')
                }
            }


            return (
                <>
                <div style={{ background: "#141414", width: expanded?"100%":"50%", height: "80px", position:expanded?'fixed':'relative', top:expanded?'90px':'0px', zIndex:artistProps.expandedArtistId===albumProps.item.id? 1000 : 'unset' }}>
                    <div style={{ display: "flex" }} className="track-card">
                        <div style={{ display: "inline-flex", position: "relative", height: "100%", aspectRatio: "1 / 1" }}>
                            <img loading="lazy" style={{ borderRadius: "50%", position: "relative", height: "100%", aspectRatio: "1 / 1" }} src={props.result.item?.images[0]?.url} alt={`${props.result.item.name} cover`}></img>
                            <div onClick={() => displayAlbums()} style={{ top: 0, left: 0, width: "100%", height: "100%", position: "absolute" }}></div>
                        </div>
                        <p style={{ display: 'inline' }} className={"track-card-text"}>Artist: {props.result?.item?.name}</p>
                      
        
                    </div>
                    <div style={{  width:(artistProps.expandedArtistId===albumProps.item.id) && expanded?"50%":"100%",height:(artistProps.expandedArtistId===albumProps.item.id) && expanded?"calc(100vh - 160px)":"0%" ,   background: "rgb(33 33 33)", overflowY:'scroll', transition:expanded?" height 1s": "none",  zIndex:artistProps.expandedArtistId===albumProps.item.id? 1000 : 'unset' }}>
                   {artistAlbumsCards}
               </div>
   
                </div>
  
               </>
            )

                ;

        case ("playlist"):
            const playlistProps = props.result as PlaylistResult



            return (
                <div style={{ display: "flex", width: "50%", height: "80px" }} className="track-card" >
                    <div style={{ display: "inline-flex", position: "relative", height: "100%", aspectRatio: "1 / 1" }}>
                        <img loading="lazy" style={{ position: "relative", height: "100%", aspectRatio: "1 / 1" }} src={props.result.item?.images[0]?.url} alt={`${props.result.item.name} cover`}></img>
                        <div onClick={() => playlistProps.displayTracks(playlistProps.item)} style={{ top: 0, left: 0, width: "100%", height: "100%", position: "absolute" }}></div>
                    </div>
                    <p style={{ display: 'inline' }} className={"track-card-text"}>Playlist: {props.result?.item?.name}</p>
                </div>
            )
        case ("track"):
            const trackProps = props.result as TrackResult

            // const isDrafted = trackProps.stagedPlaylist?.some(item=>item.id===trackProps.item.id)
            // const draftTrack=(e)=>{
            //     e.preventDefault()
            //     trackProps.setStagedPlaylist(prev=>prev?prev.concat([trackProps.item]):[trackProps.item])
            // }

            return (
                <div style={{ display: "flex", width: "50%", height: "80px" }} className="track-card" >
                    <div style={{ display: "inline-flex", position: "relative", height: "100%", aspectRatio: "1 / 1" }}>

                        <img loading="lazy" style={{ position: "relative", height: "100%", aspectRatio: "1 / 1" }} src={props.result.item?.track.album?.images[0].url} alt={`${props.result.item.track.name} cover`}></img>
                        {/* <div onClick={()=>playPreviewAudio(track.preview_url)} style={{color: !previewState?"inherit":previewState,top:0, left:0,width:"100%", height:"100%", position:"absolute"}}>preview</div> */}
                    </div>
                    <p style={{ display: 'inline' }} className={"track-card-text"}>Track: {trackProps.item?.track.name}</p>
                    <button style={{width:"40px", height: "100%", borderRadius: "10%"}} disabled={trackProps.isDrafted(trackProps.item.track.id)} onClick={(e) => trackProps.draftTrack(e, trackProps.item)}>+</button>


                </div>
            )

    }




}

export default ResultCard


