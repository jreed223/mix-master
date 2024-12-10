import React, { useContext, useEffect, useState } from "react";
import { Album, Artist, Playlist, SearchResults } from "../../../server/types";
import TrackClass from '../../models/Tracks';
import { NavigationContext } from "../../state_management/NavigationProvider";

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

    const {setIsSearching, isMobile} = useContext(NavigationContext)

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
                <div style={{ display: "flex", width: "calc(50% - 20px)", minHeight: "80px" }} className="track-card">
                    <div style={{ display: "inline-flex", position: "relative", height: "100%", aspectRatio: "1 / 1" }}>
                        <img loading="lazy" style={{ position: "relative", height: "100%", aspectRatio: "1 / 1" }} src={props.result.item?.images[0]?.url} alt={`${props.result.item?.name||"Unknown"} cover`}></img>
                        <div onClick={() =>{ isMobile?setIsSearching(false):setIsSearching(prev=>prev); albumProps.displayTracks(albumProps.item)}} style={{ top: 0, left: 0, width: "100%", height: "100%", position: "absolute" }}></div>
                    </div>
                    <p style={{ display: 'inline' }} className={"track-card-text"}>Album: {props.result?.item?.name||"Unknown"}</p>

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
                <div style={{ background: "#141414", width: expanded?"100%":"50%", minHeight: "80px", position:expanded?'fixed':'relative', top:expanded?'100px':'0px', zIndex:artistProps.expandedArtistId===albumProps.item.id? 1000 : 'unset', overflowY: 'auto' }}>
                    <div style={{ display: "flex", margin: 0, padding: "5px" }} className="track-card">
                        <div style={{ display: "inline-flex", position: "relative", height: "100%", aspectRatio: "1 / 1" }}>
                            <img loading="lazy" style={{ borderRadius: "50%", position: "relative", height: "100%", aspectRatio: "1 / 1" }} src={props.result.item?.images[0]?.url} alt={`${props.result.item?.name||"Unknown"} cover`}></img>
                            <div onClick={() => displayAlbums()} style={{ top: 0, left: 0, width: "100%", height: "100%", position: "absolute" }}></div>
                        </div>
                        <p style={{ display: 'inline' }} className={"track-card-text"}>Artist: {props.result?.item?.name||"Unknown"}</p>
                      
        
                    </div>
                    <div style={{ position:"fixed", width:(artistProps.expandedArtistId===albumProps.item.id) && expanded?isMobile?"100%":"50%":isMobile?"50%":"25%",height:(artistProps.expandedArtistId===albumProps.item.id) && expanded?"calc(100vh - 160px)":"0%" ,   background: "rgb(33 33 33)", overflowY:'auto', transition:expanded?" height 1s": "unset",  zIndex:artistProps.expandedArtistId===albumProps.item.id? 1000 : 'unset' }}>
                   {artistAlbumsCards}
               </div>
   
                </div>
  
               </>
            )

                ;

        case ("playlist"):
            const playlistProps = props.result as PlaylistResult



            return (
                <div style={{ display: "flex", width: "calc(50% - 20px)", height: "80px" }} className="track-card" >
                    <div style={{ display: "inline-flex", position: "relative", height: "100%", aspectRatio: "1 / 1" }}>
                        <img loading="lazy" style={{ position: "relative", height: "100%", aspectRatio: "1 / 1" }} src={props.result.item?.images[0]?.url} alt={`${props.result.item?.name||"unknown"} cover`}></img>
                        <div onClick={() =>{ isMobile?setIsSearching(false):setIsSearching(prev=>prev); playlistProps.displayTracks(playlistProps.item)}} style={{ top: 0, left: 0, width: "100%", height: "100%", position: "absolute" }}></div>
                    </div>
                    <p style={{ display: 'inline' }} className={"track-card-text"}>Playlist: {props.result?.item?.name||"Untitled"}</p>
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
                    <p style={{ display: 'inline' }} className={"track-card-text"}>Track: {trackProps.item?.track?.name||"Unknown"}</p>
                    <button style={{width:"40px", height: "100%", borderRadius: "10%"}} disabled={trackProps.isDrafted(trackProps.item.track.id)} onClick={(e) => {e.preventDefault(); trackProps.draftTrack(e, trackProps.item)}}>+</button>


                </div>
            )

    }




}

export default ResultCard


