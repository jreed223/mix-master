import { useContext, useEffect, useRef, useState } from "react"
import { NavigationContext } from "../../state_management/NavigationProvider"
import TrackClass from "../../models/Tracks"
import { Album, Playlist, SearchResults } from "../../../server/types"
import TrackCollection from "../../models/libraryItems"
import ResultCard from "./ResultCard"
import React from "react"
import TrackCard from "../DraftingPaneComponents/TrackComponents/TrackCard"




export default function SearchAndPlaylists({children}) {

    const {setSelectedLibraryItem, stagedPlaylist, setStagedPlaylist, stageTracks, setIsPlaylistsView, isPlaylistsView} = useContext(NavigationContext)

    const {
        setStagingState,
    isMobile } = useContext(NavigationContext)


    const clearSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setSearchQuery(null)
        setSearchresults(null)
    }


    const [expandedArtistId, setExpandedArtistId] = useState(null)
    const [searchQuery, setSearchQuery] = useState(null)
    const [searchResults, setSearchresults] = useState(null)
    const [finalQuery, setFinalQuery] = useState(null)
    const [isLoading, setIsLoading] = useState(false)



    const [searchView, setSearchView] = useState("Playlists")
    const [currentCards, setCurrentCards] = useState(null)
    const [artistCards, setArtistCards] = useState(null)
    const [albumCards, setAlbumCards] = useState(null)
    const [playlistCards, setPlaylistCards] = useState(null)
    const [trackCards, setTrackCards] = useState(null)

    // const queryRef = useRef(null)

    //**If a search query has been set, the final query is set if the query is unchanged after .75 secs */
    useEffect(()=>{
        if(searchQuery&&searchQuery.trim().length>0){
            const timer = setTimeout(()=>{
                setFinalQuery(searchQuery)
              
                
            }, 750)

        return()=>clearTimeout(timer)

        }


    },[searchQuery, searchView])
    


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
            const albumCards = searchResults.albums.items.filter(album=>album && album.id).map((album) => {
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
            const playlistCards = searchResults.playlists.items.filter(playlist=>playlist && playlist.id).map((playlist) => {
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
    

            const trackCards = searchResults.tracks.items.filter(track=>track && track.id).map((track) => {
                const collection = new TrackCollection(track.album)
                const trackClass = new TrackClass(track, collection)
                trackClass.track.name==="Good Life"?(console.log("GOOD LIFE: ", track)):console.log("...")
    
                return <TrackCard key={track?.id} tracklistArea={"search-bar-card"} onSelectedTrack={()=>{}} trackClass={trackClass} displayHidden={false} selectedLibraryItems={[]} draftTrack={stageTracks} deselectTrack={()=>{}}></TrackCard>
            })
    
            setTrackCards(trackCards)
            const artistCards = searchResults.artists.items.filter(artist=>artist && artist.id).map((artist) => {
    
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


    //**Fetches and sets search results if a final query has been set */
    useEffect(()=>{

    
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
                setIsLoading(false)
        }
    
        if(finalQuery){
            handleSearch()
        }
    },[ finalQuery])


    //**UseEffect clears the search results if the search query is null or an empty string */
      useEffect(()=>{
        if(!searchQuery||searchQuery?.trim().length<=0||(searchQuery&&searchQuery==="")){
            setSearchresults(null)
            setIsPlaylistsView(true)
            setFinalQuery(null)
        }
    },[searchQuery, setIsPlaylistsView])


  

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
            default:
                setCurrentCards(playlistCards)
        }
    }, [searchView, artistCards, playlistCards, trackCards, albumCards])

    const searchInputRef = useRef(null)

    useEffect(()=>{
        if(searchResults){
            setIsPlaylistsView(false)
            // setViewChild(false)
        }
    },[searchResults, setIsPlaylistsView])

        const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault();
                // handleSearch()
            }
        }


        return (
            <form style={{ height: "100%", width:"100%" }}>

                <div className={"search-bar2"} style={{ height: "100%", width:"100%", overflowX: 'clip' }}>
                    <div style={isMobile?{ width: "100%", height: "100%" }:{width: "75%", minWidth:"50vw", height: "100%", margin: "auto"}}>
                        <div style={{ height: "50px", alignContent: "center", display: "flex"}}>
                                <div style={{flex: 1, display:"flex", justifyContent:"center"}}><input ref={searchInputRef} style={{color:"#878787", fontSize: "1.5em",borderRadius:"25px", paddingLeft: "15px",  backgroundColor: "rgb(33 33 33)", border: "none", height:"calc(100% - 10px)", width: "75%", margin: "5px"}}type="text" placeholder="Search..." value={searchQuery} onKeyDown={(e) => { onEnter(e) }} onChange={(e) => { e.preventDefault(); setSearchQuery(e.target.value) }}></input></div>
                                <div style={{ display: "inline-flex", alignItems: "center", flex: 1, gap: "15px", justifyContent: "center"}}>

                                    <button disabled={!searchResults} style={{ borderRadius: "25px", height: "30px", width: "15%",opacity:searchResults?1:0, transition:"1s" }} onKeyDown={(e) => e.preventDefault()} onClick={ (e)=>{e.preventDefault(); setSearchView("Albums"); setIsPlaylistsView(false);}}>Albums</button>
                                    <button disabled={!searchResults} style={{ borderRadius: "25px", height: "30px", width: "15%",opacity:searchResults?1:0, transition:"1s" }} onKeyDown={(e) => e.preventDefault()} onClick={(e)=>{e.preventDefault();setSearchView("Artists"); setIsPlaylistsView(false)}}>Artists</button>
                                    <button disabled={!searchResults} style={{ borderRadius: "25px", height: "30px", width: "15%",opacity:searchResults?1:0, transition:"1s" }} onKeyDown={(e) => e.preventDefault()} onClick={ (e)=>{e.preventDefault(); setSearchView("Playlists"); setIsPlaylistsView(false)} }>Playlists</button>
                                    <button disabled={!searchResults} style={{ borderRadius: "25px", height: "30px", width: "15%",opacity:searchResults?1:0, transition:"1s" }} onKeyDown={(e) => e.preventDefault()} onClick={ (e)=>{e.preventDefault(); setSearchView("Tracks"); setIsPlaylistsView(false)} }>Tracks</button>
                                    {/* <button style={{ borderRadius: "25px", height: "25px" }} onKeyDown={(e) => e.preventDefault()} onClick={ (e)=>{e.preventDefault(); setViewChild(true)} }>My Playlists</button> */}
                                    {/* <button style={{ borderRadius: "25px", height: "25px" }} onKeyDown={(e) => e.preventDefault()} onClick={(e) => { closeSearch(e) }}>Close</button> */}
                            </div>
                        </div>
                        <div className="search-results" style={{ height: "calc(100% - 50px)", overflowY: "auto", overflowX:'clip', position: "relative" }}>


                            {isLoading?
                                <div>Loading</div>:
                                isPlaylistsView?children:currentCards&&searchQuery?
                                <>

                                            <div style={{ flex: 1, display: "flex", flexFlow: "row wrap" }}>
                                                {currentCards?.length>0?currentCards:<p>No items found from search</p>}
                                                </div>

                                </> : children


                            }
                        </div>
                    </div>
                </div>


            </form>

        )

}