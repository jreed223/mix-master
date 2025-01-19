import { useContext, useEffect, useRef, useState } from "react"
import { ViewContext } from "../../../state_management/ViewProvider.tsx"
import TrackClass from "../../../models/Tracks.ts"
import type { Album, Playlist, SearchResults } from "../../../../server/types.d.ts"
import TrackCollection from "../../../models/TrackCollection.ts"
import ResultCard from "./ResultCard.tsx"
import React from "react"
import TrackCard from "../../DraftingPaneComponents/TrackComponents/TrackCard.tsx"
import { DraftingContext } from "../../../state_management/DraftingPaneProvider.tsx"
import ProfileView, { ArtistProfileProps, UserProfileProps } from "./ProfileView.tsx"
import { border, minWidth, padding } from "@mui/system"
import { searchResults } from '../../../../server/SpotifyData/controllers/supplementalControllers/searchResults.ts';




export default function SearchAndPlaylists({ children }) {

    const { setIsPlaylistsView, isPlaylistsView, } = useContext(ViewContext)

    const {
        isMobile, selectedProfile, displayProfile } = useContext(ViewContext)

    const {
        setSelectedLibraryItem, stagedPlaylist, setStagedPlaylist, stageTracks,
        setStagingState, stagingState
    } = useContext(DraftingContext)



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
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            const timer = setTimeout(() => {
                setFinalQuery(searchQuery)


            }, 750)

            return () => clearTimeout(timer)

        }


    }, [searchQuery, searchView])



    useEffect(() => {
        const draftTrack = (trackClass: TrackClass) => {
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
            const albumCards = searchResults.albums.items.filter(album => album && album.id).map((album) => {
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
            const playlistCards = searchResults.playlists.items.filter(playlist => playlist && playlist.id).map((playlist) => {
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


            const trackCards = searchResults.tracks.items.filter(track => track && track.id).map((track) => {
                const collection = new TrackCollection(track.album)
                const trackClass = new TrackClass(track, collection)
                trackClass.track.name === "Good Life" ? (console.log("GOOD LIFE: ", track)) : console.log("...")

                return <TrackCard key={track?.id} tracklistArea={"search-bar-card"} onSelectedTrack={() => { }} trackClass={trackClass} displayHidden={false} selectedLibraryItems={[]} draftTrack={stageTracks} deselectTrack={() => { }}></TrackCard>
            })

            setTrackCards(trackCards)
            const artistCards = searchResults.artists.items.filter(artist => artist && artist.id).map((artist) => {

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
                    }}
                ></ResultCard>

            })
            setArtistCards(artistCards)
        }

    }, [expandedArtistId, searchResults, setSelectedLibraryItem, setStagedPlaylist, setStagingState, stageTracks, stagedPlaylist])


    //**Fetches and sets search results if a final query has been set */
    useEffect(() => {


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

        if (finalQuery) {
            handleSearch()
        }
    }, [finalQuery])


    //**UseEffect clears the search results if the search query is null or an empty string */
    useEffect(() => {
        if (!searchQuery || searchQuery?.trim().length <= 0 || (searchQuery && searchQuery === "")) {
            setSearchresults(null)
            setIsPlaylistsView(true)
            setFinalQuery(null)
        }
    }, [searchQuery, setIsPlaylistsView])




    useEffect(() => {
        switch (searchView) {
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

    useEffect(() => {
        if (searchResults) {
            setIsPlaylistsView(false)
        }
    }, [searchResults, setIsPlaylistsView])

    const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    }

    const hiddenButton = {
        margin: "0px",
        borderRadius: "25px",
        minWidth: "0%",
        width: "0%",
        opacity: 0,
        transition: "1s",
        border: "none",
        padding: "0px"
    }

    const visibleButton = {
        // marginBottom: isMobile ? "10px" : "0px",
        borderRadius: "25px",
        height: "30px",
        minWidth: "12%",
        width: "18%",
        opacity: searchResults ? 1 : 0,
        transition: "1s",
        border: "none",
        padding: "0px"
    }
    const visibleButton2 = {
        marginBottom: isMobile ? "10px" : "0px",
        borderRadius: "25px",
        height: "30px",
        flex: "0 1 auto",
        opacity: searchResults ? 1 : 0,
        transition: "1s",
        border: "none",
        padding: "0px"
    }
    const hiddenButton2 = {
        margin: "0px",
        borderRadius: "25px",
        flex: '0 0 0px',

        opacity: 0,
        transition: "1s",
        border: "none",
        padding: "0px"
    }


    return (
        <form style={{ height: "100%", width: "100%", minWidth: isMobile ? "calc(100vw  - 115px)" : "calc(50vw - 115px)" }}>

            <div className={"search-bar2"} style={{ height: "100%", width: "100%", overflowX: 'clip', position: 'relative' }}>
                <div style={isMobile ? { width: "100%", height: "100%", display: "flex", flexDirection: "column" } : { display: "flex", flexDirection: "column", width: "75%", minWidth: "50vw", height: "100%", margin: "auto" }}>
                    <div style={{ alignContent: "center", display: "flex", flexDirection: isMobile ? "column" : "row", margin: "auto 10px", height: isMobile?"20%":"10%", maxHeight:"100px" }}>
                        <div style={{ width: isMobile?"100%":"45%", display: "flex", justifyContent: "center", alignItems:"center" }}>
                            <input ref={searchInputRef} style={{ minWidth: "90%", maxHeight: "45px", height: "100%", color: "#878787", fontSize: "1.5em", borderRadius: "25px", paddingLeft: "15px", backgroundColor: "rgb(33 33 33)", border: "none", margin: "10px" }} type="search" placeholder="Search..." value={searchQuery} onKeyDown={(e) => { onEnter(e) }} onChange={(e) => { e.preventDefault(); setSearchQuery(e.target.value) }}></input>
                        </div>

                        <div style={{display:"flex", flex:1, justifyContent:"center", alignItems:"center", }}>
                            <div style={{ transition: "1s", display: "inline-flex", alignItems: "center", maxWidth: searchResults ? "90%" : "0%", flex:1, gap: searchResults ? "4%" : "0%", justifyContent: "center", overflow: "hidden" }}>
                                <button disabled={!searchResults || isPlaylistsView} style={{  ...visibleButton, minWidth: searchResults ? "10%" : "0%", width: "10%" }} onKeyDown={(e) => e.preventDefault()} onClick={(e) => { e.preventDefault(); setIsPlaylistsView(true) }}>&#x1F3E0;</button>
                                <button disabled={!searchResults || (searchView === "Playlists" && !isPlaylistsView)} style={{ ...visibleButton }} onKeyDown={(e) => e.preventDefault()} onClick={(e) => { e.preventDefault(); setSearchView("Playlists"); setIsPlaylistsView(false) }}>Playlists</button>
                                <button disabled={!searchResults || (searchView === "Tracks" && !isPlaylistsView)} style={{ ...visibleButton }} onKeyDown={(e) => e.preventDefault()} onClick={(e) => { e.preventDefault(); setSearchView("Tracks"); setIsPlaylistsView(false) }}>Tracks</button>
                                <button disabled={!searchResults || (searchView === "Albums" && !isPlaylistsView)} style={{ ...visibleButton }} onKeyDown={(e) => e.preventDefault()} onClick={(e) => { e.preventDefault(); setSearchView("Albums"); setIsPlaylistsView(false); }}>Albums</button>
                                <button disabled={!searchResults || (searchView === "Artists" && !isPlaylistsView)} style={{ ...visibleButton }} onKeyDown={(e) => e.preventDefault()} onClick={(e) => { e.preventDefault(); setSearchView("Artists"); setIsPlaylistsView(false) }}>Artists</button>
                            </div>
                            <div style={{ cursor: "pointer", flex: "1 1 auto ", margin:"5px auto", height: "100%", maxWidth:(stagingState==="open"&&searchResults)||(isMobile&&searchResults)?"45px":"177px", transition: "1s",display:"flex", justifyContent:"center", alignItems:"center" }}>
                            <img src="/spotify/Primary_Logo_Green_RGB.svg" style={{maxWidth: "45px"}} alt="spotify logo"/><p style={{ whiteSpace:"nowrap", fontSize:"1em", overflow:"hidden", margin:" 0 0 0 2px", opacity:(stagingState==="open"&&searchResults)||(isMobile&&searchResults)?0:1, transition: '1s'}}>Open Spotify</p>
                                {/* <div style={{ marginBottom: isMobile ? "10px" : "0px", borderRadius: "25px", height: "30px",  transition: "1s", display:"flex", alignItems:'center' }} onKeyDown={(e) => e.preventDefault()} onClick={(e) => { e.preventDefault(); }}> */}
                                    {/* <div style={{display: "flex", alignItems:"center", maxHeight: "100%"}}> */}
                                        {/* <img src="/spotify/Primary_Logo_Green_RGB.svg" style={{maxHeight: "100%"}} alt="spotify logo"/><p style={{ whiteSpace:"nowrap"}}>Open Spotify</p> */}
                                    {/* </div> */}
                                {/* </div> */}
                            </div>
                        </div>
                        {/* <button style={{ marginBottom: isMobile?"10px":"0px", borderRadius: "25px", height:"30px", minWidth: "12%", transition:"1s" }} onKeyDown={(e) => e.preventDefault()} onClick={(e)=>{e.preventDefault();}}>Open Spotify</button> */}

                    </div>

                    <ProfileView type={selectedProfile?.type} profileId={selectedProfile?.profileId} profile={selectedProfile?.profile || null}></ProfileView>


                    <div className="search-results" style={{ flex: 1, overflowY: "auto", overflowX: 'clip' }}>



                        {isLoading ?
                            <div>Loading</div> :
                            <>
                                {children}
                                {currentCards && searchQuery ? <div style={{ flex: 1, display: isPlaylistsView ? "none" : "flex", flexFlow: "row wrap" }}>
                                    {currentCards?.length > 0 ? currentCards : <p>No items found from search</p>}
                                </div> : <></>}

                            </>


                        }
                    </div>
                </div>
            </div>


        </form>

    )

}