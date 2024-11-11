import React, { useContext, useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import { Album, Playlist, SearchResults } from "../../server/types";
import ResultCard from "./ResultCard";
// import { Button } from "@mui/material";
import TrackCollection from "../models/libraryItems";
import TrackClass from "../models/Tracks";
import { NavigationContext } from "../state_management/NavigationProvider";
import { DraftingContext } from "../state_management/DraftingPaneProvider";



export default function SearchBar() {

    const { setSelectedLibraryItem, stagedPlaylist, setStagedPlaylist, } = useContext(DraftingContext)

    const { activeView,
        setActiveView,
        isSearching,
        setIsSearching,
        stagingState,
        setStagingState } = useContext(NavigationContext)


    const closeSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsSearching(false)
        if (stagingState === "closed") {
            setActiveView(["Dashboard"]);
        }
    }
    const draftTrack = (e, trackClass: TrackClass) => {
        e.preventDefault()
        setStagedPlaylist(prev => prev ? prev.concat([trackClass]) : [trackClass])
        setStagingState("open")
    }

    const displaySelected = async (item: Playlist | Album['album']) => {

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
            setSelectedLibraryItem(tracklistClass)
            setStagingState('open')

        } else {
            const tracklistClass = new TrackCollection(item)
            setSelectedLibraryItem(tracklistClass)
            setStagingState('open')

        }
    }

    const isDrafted = (trackId: string) => stagedPlaylist?.some(item => item.track.id === trackId)

    const [expandedArtistId, setExpandedArtistId] = useState(null)
    const [searchQuery, setSearchQuery] = useState(null)
    const [searchResults, setSearchresults] = useState(null)

    type ResultTypes = SearchResults['albums']['items'] | SearchResults['playlists']['items'] | SearchResults['artists']['items'] | SearchResults['tracks']['items']
    const resultList = (resultsObject: SearchResults) => {
        let fullItemList: ResultTypes[] = []

        fullItemList = fullItemList.concat(resultsObject?.albums.items)
        fullItemList = fullItemList.concat(resultsObject?.artists.items)
        fullItemList = fullItemList.concat(resultsObject?.tracks.items)
        fullItemList = fullItemList.concat(resultsObject?.playlists.items)
        // }
        console.log("FILL ITEM LIST: ", fullItemList)
    }

    const handleSearch = async () => {
        // event.preventDefault()
        if (isSearching) {

            const results = await fetch("/spotify-data/search-results", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: searchQuery })
                // headers: {"id" : `${this.id}` }
            })
            const newResults = await results.json()
            console.log(newResults)
            setSearchresults(newResults)
            resultList(newResults)

        } else {
            setIsSearching(true)
            // props.setDisabledDashboard(true)
            if (activeView.at(-1) === "Dashboard") {
                setActiveView(["User Playlists"])

            }
        }
    }



    if (searchResults) {
        const albumCards = searchResults.albums.items.map((album) => {
            return <ResultCard
                key={album.id}
                popularity={null}
                result={{
                    type: "album",
                    item: album,
                    displayTracks: displaySelected
                }}></ResultCard>
        })

        const playlistCards = searchResults.playlists.items.map((playlist) => {
            return <ResultCard
                key={playlist.id}
                popularity={null}
                result={{
                    type: "playlist",
                    item: playlist,
                    displayTracks: displaySelected
                }}></ResultCard>
        })

        const trackCards = searchResults.tracks.items.map((track) => {
            const trackClass = new TrackClass(track)

            return <ResultCard
                popularity={track.popularity}
                key={track.id}
                result={{
                    type: "track",
                    item: trackClass,
                    draftTrack: draftTrack,
                    isDrafted: isDrafted
                }}></ResultCard>
        })

        const artistCards = searchResults.artists.items.map((artist) => {


            return <ResultCard
                key={artist.id}
                popularity={artist.popularity}
                result={{
                    type: "artist",
                    item: artist,
                    displayTracks: displaySelected,
                    draftTrack: draftTrack,
                    isDrafted: isDrafted,
                    expandedArtistId: expandedArtistId,
                    setExpandedArtistId: setExpandedArtistId

                }}></ResultCard>
        })



        const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleSearch()
            }
        }


        return (
            <form style={{ height: "100%" }}>

                <div className={"search-bar"} style={isSearching ? { height: "100%", width: "50%", overflowX: 'clip' } : { height: "100%", width: "0%", overflowX: 'clip' }}>
                    <div style={{ width: "50vw", height: "100%" }}>
                        <div style={{ height: "40px" }}>
                            <button style={{ paddingTop: "15px", paddingLeft: "15px" }} onKeyDown={(e) => e.preventDefault()} onClick={(e) => { closeSearch(e) }}>Close</button>
                            <input type="text" placeholder="Search..." value={searchQuery} onKeyDown={(e) => { onEnter(e) }} onChange={(e) => { e.preventDefault(); isSearching ? setSearchQuery(e.target.value) : setSearchQuery(prev => prev) }}></input>
                        </div>
                        <div className="search-results" style={{ height: "calc(100% - 40px)", overflowY: "hidden", position: "relative" }}>

                            {searchResults ?
                                <>
                                    <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
                                        <div style={{ width: "calc(100%)", height: "100%", display: "flex", flexDirection: "column", gap: "10px", }} >

                                            <div style={{ display: "flex", flexFlow: "row wrap", overflowY: "scroll", flex: 1 }}>{artistCards}</div>
                                            <div style={{ overflowY: "scroll", flex: 2, display: "flex", flexFlow: "row wrap" }}>{trackCards}</div>

                                        </div>
                                        <div style={{ width: "0%", height: "100%", display: "flex", flexDirection: "column" }} >

                                            <div style={{ overflowY: "scroll", flex: 1 }}>{albumCards}</div>
                                            <div style={{ overflowY: "scroll", flex: 1 }}>{playlistCards}</div>

                                        </div>
                                    </div>
                                </> : <></>


                            }
                        </div>
                    </div>
                </div>
                <button style={{ position: "absolute", right: "15px", top: "15px" }} type="submit" onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); handleSearch(); }}>search</button>


            </form>

        )
    } else {
        return (<>
            <form style={{ height: "100%" }}>

                <div className={"search-bar"} style={isSearching ? { width: "50%" } : { width: "0%" }}>
                    <button style={{ marginTop: "15px", marginLeft: "15px" }} onClick={(e) => closeSearch(e)}>Close</button>
                    <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => { isSearching ? setSearchQuery(e.target.value) : setSearchQuery(prev => prev) }}></input>
                    <div className="search-results">


                    </div>

                </div>
                <button style={{ position: "absolute", right: "15px", top: "15px" }} type="submit" onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); handleSearch(); }}>search</button>

            </form>

        </>)
    }
}