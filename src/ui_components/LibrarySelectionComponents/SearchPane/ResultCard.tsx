import React, { useContext, useEffect, useState } from "react";
import type { Album, Artist, Playlist, SearchResults } from "../../../../server/types.d.ts";
import TrackClass from '../../../models/TrackClass.ts';
import { ViewContext } from "../../../state_management/ViewProvider.tsx";
import { DraftingContext } from "../../../state_management/DraftingPaneProvider.tsx";
import { Hidden } from "@mui/material";
import { ArtistProfileProps, UserProfileProps } from "./ProfileView.tsx";
import TrackCollection from "../../../models/TrackCollection.ts";

type TrackResult = {
    type: "track"
    item: TrackClass
    draftTrack: (e: any, trackClass: TrackClass) => void
    isDrafted: (trackId: string) => boolean
}

type AlbumResult = {
    type: "album"
    item: Album['album']
    displayTracks: (item: Playlist | Album["album"] | TrackCollection) => void
}

type PlaylistResult = {
    type: "playlist"
    item: Playlist
    displayTracks: (item: Playlist | Album["album"] | TrackCollection) => void
}

type ArtistResult = {
    type: "artist"
    item: Artist
    displayTracks: (item: Playlist | Album["album"] | TrackCollection) => void
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

    const { isMobile, setSelectedProfile, setDisplayProfile, user, setIsPlaylistsView } = useContext(ViewContext)
    const { stagingState, setStagingState, selectedLibraryItem } = useContext(DraftingContext)

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

    const handleProfileSelection = (e) => {
        e.stopPropagation();

        if (props.result.type === "album") {
            setDisplayProfile(true)
            setSelectedProfile(prev => prev?.profileId === albumProps.item.artists.at(0).id ? prev : { type: 'artist', profileId: albumProps.item.artists.at(0).id })
        } else if (props.result.type === "playlist" && playlistProps.item.owner.id === user.id) {
            setIsPlaylistsView(true);
        } else if (props.result.type === "playlist") {
            setDisplayProfile(true)
            setSelectedProfile(prev => prev?.profileId === playlistProps.item.owner.id ? prev : { type: "user", profileId: playlistProps.item.owner.id } as UserProfileProps)
        }
    }


    if (props.result.type === "album" || props.result.type === "playlist") {
        return (
            <div style={{ position: "relative", display: "flex", width: isMobile?"calc(100% - 20px)":"calc(50% - 20px)", height: isMobile ? "8vh" : "12vh", minHeight: isMobile ? 'unset' : '80px', }} className="track-card">
                <div style={{ display: "inline-flex", position: "relative", height: "100%", aspectRatio: "1 / 1" }}>
                    <img onClick={selectedLibraryItem?.id !== props.result?.item.id ? () => { props.result.type === "album" ? albumProps.displayTracks(albumProps.item) : playlistProps.displayTracks(playlistProps.item) } : stagingState === "closed" ? () => { setStagingState("open") } : () => { }} loading="lazy" style={{ cursor: (selectedLibraryItem?.id !== props.result?.item.id || stagingState === 'closed') ? 'pointer' : 'default', position: "relative", height: "100%", aspectRatio: "1 / 1" }} src={props.result.item?.images?.at(0)?.url} alt={`${props.result.item?.name || "Unknown"} cover`}></img>
                </div>

                <div onClick={selectedLibraryItem?.id !== props.result?.item.id ? () => { props.result.type === "album" ? albumProps.displayTracks(albumProps.item) : playlistProps.displayTracks(playlistProps.item) } : stagingState === "closed" ? () => { setStagingState("open") } : () => { }} className={""} style={{ marginLeft: "7px", cursor: (selectedLibraryItem?.id !== props.result?.item.id || stagingState === 'closed') ? 'pointer' : 'default', position: "relative", display: "flex", flexDirection: "column", overflow: 'hidden', flexGrow: '1', width: "0%", height: "100%", justifyContent: 'center' }}>
                    <p style={{ margin: "0", color: selectedLibraryItem?.id === props.result?.item.id ? "rgb(135, 135, 135, 0.35)" : "inherit" }} className={"track-card-text"}>{props.result?.item?.name || "Unknown"}</p>
                    <div style={{ width: "min-content", textWrap: 'nowrap', maxWidth: "100%", overflow: 'hidden' }} className="">
                        <p onClick={(e) => { handleProfileSelection(e) }} style={{ cursor: 'pointer', margin: "0", color: selectedLibraryItem?.id === props.result?.item.id ? "rgb(135, 135, 135, 0.35)" : "inherit" }} className={"track-card-text artist-text"}>{props.result.type === "album" ? albumProps.item?.artists?.at(0).name || "Unknown" : playlistProps?.item?.owner?.display_name}</p>

                    </div>

                </div>

            </div>
        )

    } else if (props.result.type === "artist") {

        return (
            <>
                <div style={{ height: "calc(100% - 100px)", background: "#141414", transition: expanded ? 'width 1s' : "none", width: isMobile ? "100%" : "50%", overflowY: 'hidden', display: "flex", flexDirection: 'column' }}>
                    <div onClick={() => { setDisplayProfile(true); setSelectedProfile({ type: 'artist', profileId: artistProps.item.id, profile: artistProps.item } as ArtistProfileProps) }} style={{ cursor: "pointer", display: "flex", margin: 0, padding: "5px", height: isMobile ? "8vh" : "12vh", minHeight: isMobile ? 'unset' : '80px' }} className="track-card">
                        <div style={{ display: "inline-flex", position: "relative", height: "100%", aspectRatio: "1 / 1" }}>
                            <img loading="lazy" style={{ borderRadius: "50%", position: "relative", height: "100%", aspectRatio: "1 / 1" }} src={props.result.item?.images[0]?.url || "default-artist-img.png"} alt={`${props.result.item?.name || "Unknown"} cover`}></img>
                            <div style={{ top: 0, left: 0, width: "100%", height: "100%", position: "absolute" }}></div>
                        </div>
                        <p style={{ display: 'inline', margin: 'auto 7px' }} className={"track-card-text "}>{props.result?.item?.name || "Unknown"}</p>


                    </div>

                </div>

            </>
        )
    }






}

export default ResultCard


