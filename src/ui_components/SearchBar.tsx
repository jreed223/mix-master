import React, { useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import UserLibrary from './SinglePageView';
import { Album, Playlist, SearchResults, Track } from "../../server/types";
import ResultCard from "./ResultCard";
// import { Button } from "@mui/material";
import { albums } from '../../server/SpotifyData/controllers/libraryControllers/albums';
import TrackCollection from "../models/libraryItems";
import TrackClass from "../models/Tracks";

interface SearchProps {
    isSearching: boolean
    setIsSearching: React.Dispatch<React.SetStateAction<boolean>>
    stagingState: string
    setStagingState: React.Dispatch<React.SetStateAction<string>>

    setDisabledDashboard: (value: React.SetStateAction<boolean>) => void
    setActiveView: React.Dispatch<React.SetStateAction<string[]>>
    searchQuery: string
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
    searchResults: SearchResults
    handleSearch: () => Promise<void>
    setStagedPlaylist: React.Dispatch<React.SetStateAction<TrackClass[]>>
    stagedPlaylist: TrackClass[]
    setSelectedLibraryItem: React.Dispatch<React.SetStateAction<TrackCollection>>


}


export default function SearchBar(props: SearchProps) {

    const closeSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        props.setIsSearching(false)
        if (props.stagingState === "closed") {
            props.setActiveView(["dashboard"]);
            props.setDisabledDashboard(false);
        }
    }
    const draftTrack = (e, trackClass: TrackClass) => {
        e.preventDefault()
        props.setStagedPlaylist(prev => prev ? prev.concat([trackClass]) : [trackClass])
        props.setStagingState("open")
    }

    const displayTracks = async (item: Playlist | Album['album']) => {

        if (item.type === "album") {
            console.log(item.href)
            const albumObject: Album['album'] = await fetch("/spotify-data/album", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: item.id })
                // headers: {"id" : `${this.id}` }
            }).then(async (res) => {
                const album = await res.json()
                return album
            })
            const tracklistClass = new TrackCollection(albumObject)
            console.log('TRACKLIST CLASS: ', tracklistClass)
            props.setSelectedLibraryItem(tracklistClass)
            props.setStagingState('open')

        } else {



            const tracklistClass = new TrackCollection(item)
            props.setSelectedLibraryItem(tracklistClass)
            props.setStagingState('open')

        }


    }

    const isDrafted = (trackId: string) => props.stagedPlaylist?.some(item => item.track.id === trackId)

    const [expandedArtistId, setExpandedArtistId] = useState(null)



    if (props.searchResults) {
        const albumCards = props.searchResults.albums.items.map((album) => {
            return <ResultCard
                key={album.id}
                popularity={null}
                result={{
                    type: "album",
                    item: album,
                    displayTracks: displayTracks
                }}></ResultCard>
        })

        const playlistCards = props.searchResults.playlists.items.map((playlist) => {
            return <ResultCard
                key={playlist.id}
                popularity={null}
                result={{
                    type: "playlist",
                    item: playlist,
                    displayTracks: displayTracks
                }}></ResultCard>
        })

        const trackCards = props.searchResults.tracks.items.map((track) => {
            const trackClass = new TrackClass(track)

            return <ResultCard
                popularity={track.popularity}
                key={track.id}
                result={{
                    type: "track",
                    item: trackClass,
                    draftTrack: draftTrack,
                    isDrafted: isDrafted
                    // stagedPlaylist: props.stagedPlaylist,
                    // setStagedPlaylist: props.setStagedPlaylist
                }}></ResultCard>
        })

        const artistCards = props.searchResults.artists.items.map((artist) => {


            return <ResultCard
                key={artist.id}
                popularity={artist.popularity}
                result={{
                    type: "artist",
                    item: artist,
                    displayTracks: displayTracks,
                    draftTrack: draftTrack,
                    isDrafted: isDrafted,
                    expandedArtistId: expandedArtistId,
                    setExpandedArtistId: setExpandedArtistId

                }}></ResultCard>
        })
        // const searchCards = albumCards.concat(artistCards).concat(trackCards).concat(playlistCards)
        const sortResults = unssortedCards => [...unssortedCards].sort((a, b) => b.props.popularity - a.props.popularity)


        const sortedArtistCards = sortResults(artistCards)
        // const sortedAlbumCards = sortResults(albumCards)
        const sortedTrackCards = sortResults(trackCards)
        // const sortedPlaylistCards = sortResults(albumCards)


        const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault();
                props.handleSearch()
            }
        }


        return (
            <>
                {/* <div className="search-bar-container" style={props.isSearching?{backgroundColor:"#000000bd", width:"100%", left: props.stagingState==="open"?"50%":"0"}:{width:"0%", left: props.stagingState==="open"?"50%":"0"}}>


         </div> */}
                <div className={"search-bar"} style={props.isSearching ? { height: "100%", width: "50%", overflowX: 'clip' } : { height: "100%", width: "0%", overflowX: 'clip' }}>
                    <div style={{width:"50vw", height: "100%"}}>
                    <div style={{ height: "40px" }}>
                        <button style={{ paddingTop: "15px", paddingLeft: "15px" }} onKeyDown={(e) => e.preventDefault()} onClick={(e) => { closeSearch(e) }}>Close</button>
                        <input type="text" placeholder="Search..." value={props.searchQuery} onKeyDown={(e) => { onEnter(e) }} onChange={(e) => { e.preventDefault(); props.isSearching ? props.setSearchQuery(e.target.value) : props.setSearchQuery(prev => prev) }}></input>
                    </div>
                    <div className="search-results" style={{ height: "calc(100% - 40px)", overflowY: "hidden", position: "relative" }}>

                        {props.searchResults ?
                            <>
                                {/* {sortedCards} */}
                                <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
                                <div style={{width:"calc(100%)", height: "100%", display: "flex", flexDirection: "column", gap: "10px", }} >

                                    <div style={{ display: "flex", flexFlow:"row wrap", overflowY: "scroll", flex:1 }}>{artistCards}</div>
                                    <div style={{ overflowY: "scroll", flex: 2, display: "flex", flexFlow:"row wrap" }}>{trackCards}</div>

                                </div>
                                <div style={{width: "0%", height: "100%", display: "flex", flexDirection: "column" }} >

                                    <div style={{ overflowY: "scroll", flex: 1 }}>{albumCards}</div>
                                    <div style={{ overflowY: "scroll", flex: 1 }}>{playlistCards}

                                    </div>
                                </div>
                                </div>
                            </> : <></>


                        }
                    </div>
                    </div>
                </div>

            </>

        )
    } else {
        return (<>
            <div className={"search-bar"} style={props.isSearching ? { width: "50%" } : { width: "0%" }}>
                <button style={{ marginTop: "15px", marginLeft: "15px" }} onClick={(e) => closeSearch(e)}>Close</button>
                <input type="text" placeholder="Search..." value={props.searchQuery} onChange={(e) => { props.isSearching ? props.setSearchQuery(e.target.value) : props.setSearchQuery(prev => prev) }}></input>
                <div className="search-results">


                </div>

            </div>
        </>)
    }
}