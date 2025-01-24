import React, { createContext, useCallback, useMemo, useState } from "react"
import TrackClass from "../models/TrackClass.ts"
import { TrackData } from "../ui_components/DraftingPaneComponents/Playlists/SelectedPlaylistArea.tsx"
import type { Artist, Features } from "../../server/types.d.ts"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
// import { Button } from "@mui/material";



export type TracklistContextType = {
    allTracks: TrackClass[]
    setAllTracks: React.Dispatch<React.SetStateAction<TrackClass[]>>
    trackDataState: TrackData[]
    setTrackDataState: React.Dispatch<React.SetStateAction<TrackData[]>>

    // selectedFeatures: Record<string, number>
    // setSelecetedFeatures: React.Dispatch<React.SetStateAction<Record<string, number>>>

    filteredTracks: TrackClass[]
    setFilteredTracks: React.Dispatch<React.SetStateAction<TrackClass[]>>
    loadingState: string
    setLoadingState: React.Dispatch<React.SetStateAction<string>>

    // popularityFilter: number
    // setPopularityFilter: React.Dispatch<React.SetStateAction<number>>
    // dateRange: [Date, Date]
    // setDateRange: React.Dispatch<React.SetStateAction<Date|[Date, Date]>>
    // artistsList: Artist[]
    // setArtistsList: React.Dispatch<React.SetStateAction<Artist[]>>
    // artistQuery: string
    // setArtistQuery: React.Dispatch<React.SetStateAction<string>>
    // selectedArtistFilters: Artist[]
    // setSelectedArtistFilters: React.Dispatch<React.SetStateAction<Artist[]>>
    // filterFeatures: () => Promise<void>
}

    const TracklistContext = createContext<TracklistContextType>(null)


export default function TracklistProvider({children}){
    const [allTracks, setAllTracks] = useState<TrackClass[]>(null)
    const [trackDataState, setTrackDataState] = useState<TrackData[]>(null) //{batch1: {Tracks = [], audioFeatures: false, categories: false}}
    // const [selectedFeatures, setSelecetedFeatures] = useState<Record<string, number>>({})
    const [filteredTracks, setFilteredTracks] = useState<TrackClass[] | null>([])
    const [loadingState, setLoadingState] = useState<string>(null)
    // const [popularityFilter, setPopularityFilter] = useState<number>(null)
    // const [dateRange, setDateRange] = useState<[Date, Date]>(null);
    // const [artistsList, setArtistsList] = useState<Artist[]>(null)


const context = useMemo(()=>({ allTracks, setAllTracks, trackDataState, setTrackDataState,  filteredTracks, setFilteredTracks, loadingState, setLoadingState}),[allTracks, trackDataState, filteredTracks, loadingState])



    return(
        <TracklistContext.Provider value={context}>
            {children}
        </TracklistContext.Provider>
    )
}

export {TracklistContext}