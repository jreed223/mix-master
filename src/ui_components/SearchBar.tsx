import React, { useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import { Album, Playlist, SearchResults } from "../../server/types";
import ResultCard from "./ResultCard";
// import { Button } from "@mui/material";
import TrackCollection from "../models/libraryItems";
import TrackClass from "../models/Tracks";
import { ActiveView } from "./NavBar";

interface SearchProps {
    activeView: ActiveView[];
    isSearching: boolean
    setIsSearching: React.Dispatch<React.SetStateAction<boolean>>
    stagingState: string
    setStagingState: React.Dispatch<React.SetStateAction<string>>

    setDisabledDashboard: (value: React.SetStateAction<boolean>) => void
    setActiveView: React.Dispatch<React.SetStateAction<ActiveView[]>>

    setStagedPlaylist: React.Dispatch<React.SetStateAction<TrackClass[]>>
    stagedPlaylist: TrackClass[]
    setSelectedLibraryItem: React.Dispatch<React.SetStateAction<TrackCollection>>


}


export default function SearchBar(props: SearchProps) {

    const closeSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        props.setIsSearching(false)
        if (props.stagingState === "closed") {
            props.setActiveView(["Dashboard"]);
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
    
const [searchQuery, setSearchQuery] = useState(null)
const [searchResults, setSearchresults] = useState(null)

type ResultTypes = SearchResults['albums']['items']|SearchResults['playlists']['items']|SearchResults['artists']['items']|SearchResults['tracks']['items']
const resultList=(resultsObject: SearchResults)=>{
    let fullItemList :ResultTypes[]= []
        
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
        if(props.activeView.at(-1)==="Dashboard"){
            props.setActiveView(["User Playlists"])
            
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
                    displayTracks: displayTracks
                }}></ResultCard>
        })

        const playlistCards = searchResults.playlists.items.map((playlist) => {
            return <ResultCard
                key={playlist.id}
                popularity={null}
                result={{
                    type: "playlist",
                    item: playlist,
                    displayTracks: displayTracks
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
                    // stagedPlaylist: props.stagedPlaylist,
                    // setStagedPlaylist: props.setStagedPlaylist
                }}></ResultCard>
        })

        const artistCards = searchResults.artists.items.map((artist) => {


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
                handleSearch()
            }
        }


        return (
            
                     <form style={{height:"100%"}}>

                <div className={"search-bar"} style={props.isSearching ? { height: "100%", width: "50%", overflowX: 'clip' } : { height: "100%", width: "0%", overflowX: 'clip' }}>
                    <div style={{width:"50vw", height: "100%"}}>
                    <div style={{ height: "40px" }}>
                        <button style={{ paddingTop: "15px", paddingLeft: "15px" }} onKeyDown={(e) => e.preventDefault()} onClick={(e) => { closeSearch(e) }}>Close</button>
                        <input type="text" placeholder="Search..." value={searchQuery} onKeyDown={(e) => { onEnter(e) }} onChange={(e) => { e.preventDefault(); props.isSearching ? setSearchQuery(e.target.value) : setSearchQuery(prev => prev) }}></input>
                    </div>
                    <div className="search-results" style={{ height: "calc(100% - 40px)", overflowY: "hidden", position: "relative" }}>

                        {searchResults ?
                            <>
                                {/* {sortedCards} */}
                                <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
                                <div style={{width:"calc(100%)", height: "100%", display: "flex", flexDirection: "column", gap: "10px", }} >

                                    <div style={{ display: "flex", flexFlow:"row wrap", overflowY: "scroll", flex:1 }}>{artistCards}</div>
                                    <div style={{ overflowY: "scroll", flex: 2, display: "flex", flexFlow:"row wrap" }}>{trackCards}</div>

                                </div>
                                <div style={{width: "0%", height: "100%", display: "flex", flexDirection: "column" }} >

                                    <div style={{ overflowY: "scroll", flex: 1 }}>{albumCards}</div>
                                    <div style={{ overflowY: "scroll", flex: 1 }}>{playlistCards}</div>
                                    
                                </div>
                                </div>
                            </> : <></>


                        }
                    </div>
                    </div>
                </div>
                <button style={{position: "absolute", right:"15px", top: "15px"}} type="submit" onClick={(e:React.MouseEvent<HTMLButtonElement>)=>{e.preventDefault();handleSearch(); }}>search</button>


            </form>

        )
    } else {
        return (<>
                             <form style={{height:"100%"}}>

            <div className={"search-bar"} style={props.isSearching ? { width: "50%" } : { width: "0%" }}>
                <button style={{ marginTop: "15px", marginLeft: "15px" }} onClick={(e) => closeSearch(e)}>Close</button>
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => { props.isSearching ? setSearchQuery(e.target.value) : setSearchQuery(prev => prev) }}></input>
                <div className="search-results">


                </div>

            </div>
            <button style={{position: "absolute", right:"15px", top: "15px"}} type="submit" onClick={(e:React.MouseEvent<HTMLButtonElement>)=>{e.preventDefault();handleSearch(); }}>search</button>

            </form>

        </>)
    }
}