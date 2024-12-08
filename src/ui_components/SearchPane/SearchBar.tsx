import React, { useContext, useEffect, useRef, useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import { Album, Playlist, SearchResults } from "../../../server/types";
import ResultCard from "./ResultCard";
// import { Button } from "@mui/material";
import TrackCollection from "../../models/libraryItems";
import TrackClass from "../../models/Tracks";
import { NavigationContext } from "../../state_management/NavigationProvider";
import TrackCard from "../DraftingPaneComponents/TrackComponents/TrackCard";



export default function SearchBar() {

    const {setSelectedLibraryItem, stagedPlaylist, setStagedPlaylist, stageTracks} = useContext(NavigationContext)

    const { activeView,
        setActiveView,
        isSearching,
        setIsSearching,
        stagingState,
        setStagingState,
    isMobile } = useContext(NavigationContext)


    const closeSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsSearching(false)
        if (stagingState === "closed"&& !isMobile) {
            setActiveView(["Dashboard"]);
        }
    }


    const [expandedArtistId, setExpandedArtistId] = useState(null)
    const [searchQuery, setSearchQuery] = useState(null)
    const [searchResults, setSearchresults] = useState(null)
    const [finalQuery, setFinalQuery] = useState(null)
    const [isLoading, setIsLoading] = useState(false)



    const [searchView, setSearchView] = useState("Artists")
    const [currentCards, setCurrentCards] = useState(null)
    const [artistCards, setArtistCards] = useState(null)
    const [albumCards, setAlbumCards] = useState(null)
    const [playlistCards, setPlaylistCards] = useState(null)
    const [trackCards, setTrackCards] = useState(null)

    const queryRef = useRef(null)
    useEffect(()=>{
        if(isSearching){
            const timer = setTimeout(()=>{
                setFinalQuery(searchQuery)
                
            }, 750)

        return()=>clearTimeout(timer)

        }


    },[isSearching, searchQuery])
    
    useEffect(()=>{
        if(!isSearching){
            queryRef.current=finalQuery
        }
    },[finalQuery, isSearching])


    useEffect(()=>{
        const draftTrack = ( trackClass: TrackClass) => {
            console.log(" TRACK TRACKCKLASS: ", trackClass)
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

        if (searchResults) {
            const albumCards = searchResults.albums.items.map((album) => {
                return <ResultCard
                    key={album?.id}
                    popularity={null}
                    result={{
                        type: "album",
                        item: album,
                        displayTracks: displaySelected
                    }}></ResultCard>
            })
            setAlbumCards(albumCards)
            const playlistCards = searchResults.playlists.items.map((playlist) => {
                return <ResultCard
                    key={playlist?.id}
                    popularity={null}
                    result={{
                        type: "playlist",
                        item: playlist,
                        displayTracks: displaySelected
                    }}></ResultCard>
            })
            setPlaylistCards(playlistCards)
            console.log(searchResults.tracks)
    

            const trackCards = searchResults.tracks.items.map((track) => {
                const collection = new TrackCollection(track.album)
                const trackClass = new TrackClass(track, collection)
                trackClass.track.name==="Good Life"?(console.log("GOOD LIFE: ", track)):console.log("...")
    
                return <TrackCard key={track?.id} tracklistArea={"search-bar-card"} onSelectedTrack={()=>{}} trackClass={trackClass} displayHidden={false} selectedLibraryItems={[]} draftTrack={stageTracks} deselectTrack={()=>{}}></TrackCard>
            })
    
            setTrackCards(trackCards)
            const artistCards = searchResults.artists.items.map((artist) => {
    
    
                return <ResultCard
                    key={artist?.id}
                    popularity={artist?.popularity}
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
            setArtistCards(artistCards)
        }

    },[expandedArtistId, searchResults, setSelectedLibraryItem, setStagedPlaylist, setStagingState, stageTracks, stagedPlaylist])

    useEffect(()=>{
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
   
                setIsLoading(true)
                const results = await fetch("/spotify-data/search-results", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query: finalQuery })
                    // headers: {"id" : `${this.id}` }
                })
                const newResults = await results.json()
                console.log(newResults)
                setSearchresults(newResults)
                resultList(newResults)
                setIsLoading(false)
        }
    
        if(finalQuery){
            handleSearch()
        }
    },[ finalQuery])

    const [hideSrchBtn, setHideSrchBtn] = useState(false)
    useEffect(()=>{
        if(isSearching){
            const hideButton = setTimeout(()=>{
                setHideSrchBtn(true)
            }, 1000)

            return () => clearTimeout(hideButton)
        }else{
            setHideSrchBtn(false)
        }
    },[isSearching])

    useEffect(()=>{
        switch(searchView){
            case "Artists":
                setCurrentCards(artistCards)
                break;
            case "Playlists":
                setCurrentCards(playlistCards)
                break;
            case "Tracks":
                setCurrentCards(trackCards)
                break;
            case "Albums":
                setCurrentCards(albumCards)
                break;
        }
    }, [searchView, artistCards, playlistCards, trackCards, albumCards])

    const handleSearchButton = (e: React.MouseEvent<HTMLButtonElement>) => { 
        e.preventDefault(); 
       

        if(isSearching){
            setFinalQuery(searchQuery)
        }else{
            setIsSearching(true)
            setActiveView(prev=>prev.at(-1)==="Dashboard"?['User Playlists']:prev)
        }

    }



        const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault();
                // handleSearch()
            }
        }


        return (
            <form style={{ height: "100%" }}>

                <div className={"search-bar"} style={isSearching ? { height: "100%", width: isMobile?"100%":"50%", overflowX: 'clip' } : { height: "100%", width: "0%", overflowX: 'clip' }}>
                    <div style={{ width: isMobile?"100vw":"50vw", height: "100%" }}>
                        <div style={{ height: "50px", alignContent: "center", display: "flex"}}>
                                <input style={{color:"#878787", fontSize: "1.5em", backgroundColor: "#141414", border: "none", height:"calc(100% - 10px)", width: "35%", margin: "5px"}}type="text" placeholder="Search..." value={searchQuery} onKeyDown={(e) => { onEnter(e) }} onChange={(e) => { e.preventDefault(); isSearching ? setSearchQuery(e.target.value) : (setSearchQuery(null)) }}></input>
                                <div style={{ display: "inline-flex", alignItems: "flex-end", flex: 1, gap: "15px", justifyContent: "center"}}>
                                    <button style={{ borderRadius: "25px", height: "25px" }} onKeyDown={(e) => e.preventDefault()} onClick={ (e)=>{e.preventDefault(); setSearchView("Albums")}}>Albums</button>
                                    <button style={{ borderRadius: "25px", height: "25px" }} onKeyDown={(e) => e.preventDefault()} onClick={(e)=>{e.preventDefault();setSearchView("Artists")}}>Artists</button>
                                    <button style={{ borderRadius: "25px", height: "25px" }} onKeyDown={(e) => e.preventDefault()} onClick={ (e)=>{e.preventDefault(); setSearchView("Playlists")} }>Playlists</button>
                                    <button style={{ borderRadius: "25px", height: "25px" }} onKeyDown={(e) => e.preventDefault()} onClick={ (e)=>{e.preventDefault(); setSearchView("Tracks")} }>Tracks</button>
                                    <button style={{ borderRadius: "25px", height: "25px" }} onKeyDown={(e) => e.preventDefault()} onClick={(e) => { closeSearch(e) }}>Close</button>
                            </div>
                        </div>
                        <div className="search-results" style={{ height: "calc(100% - 40px)", overflowY: "hidden", overflowX:'clip', position: "relative" }}>


                            {isLoading?
                                <div>Loading</div>:
                            searchResults ?
                                <>
                                    {/* <div style={{ height: "100%", display: "flex", flexDirection: "row", overflow: "auto" }}> */}
                                        {/* <div style={{ flex:1, height: "100%", flexDirection: "column", gap: "10px", }} > */}

                                            <div style={{ flex: 1, display: "flex", flexFlow: "row wrap" }}>
                                                {currentCards}
                                                </div>

                                        {/* </div> */}

                                    {/* </div> */}
                                </> : <></>


                            }
                        </div>
                    </div>
                </div>
                <button style={{ display:hideSrchBtn?"none":"inline-block", position: "absolute", right: "15px", top: "15px", borderRadius: "25px", height: "25px", opacity: isSearching?0:1, transition: isSearching?"1s": "2s"}} type="submit" onClick={(e: React.MouseEvent<HTMLButtonElement>) => { handleSearchButton(e)}}>search</button>


            </form>

        )

}