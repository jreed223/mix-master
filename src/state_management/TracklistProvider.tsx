import React, { createContext, useCallback, useMemo, useState } from "react"
import TrackClass from "../models/Tracks"
import { TrackData } from "../ui_components/DraftingPaneComponents/Playlists/SelectedPlaylistArea"
import { Artist, Features } from "../../server/types"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
// import { Button } from "@mui/material";



export type TracklistContextType = {
    allTracks: TrackClass[]
    setAllTracks: React.Dispatch<React.SetStateAction<TrackClass[]>>
    trackDataState: TrackData[]
    setTrackDataState: React.Dispatch<React.SetStateAction<TrackData[]>>
    selectedFeatures: Record<string, number>
    setSelecetedFeatures: React.Dispatch<React.SetStateAction<Record<string, number>>>
    filteredTracks: TrackClass[]
    setFilteredTracks: React.Dispatch<React.SetStateAction<TrackClass[]>>
    loadingState: string
    setLoadingState: React.Dispatch<React.SetStateAction<string>>
    popularityFilter: number
    setPopularityFilter: React.Dispatch<React.SetStateAction<number>>
    dateRange: [Date, Date]
    setDateRange: React.Dispatch<React.SetStateAction<[Date, Date]>>
    artistsList: Artist[]
    setArtistsList: React.Dispatch<React.SetStateAction<Artist[]>>
    artistQuery: string
    setArtistQuery: React.Dispatch<React.SetStateAction<string>>
    selectedArtistFilters: Artist[]
    setSelectedArtistFilters: React.Dispatch<React.SetStateAction<Artist[]>>
    filterFeatures: () => Promise<void>
}

    const TracklistContext = createContext<TracklistContextType>(null)


export default function TracklistProvider({children}){
    const [allTracks, setAllTracks] = useState<TrackClass[]>(null)
    const [trackDataState, setTrackDataState] = useState<TrackData[]>(null) //{batch1: {Tracks = [], audioFeatures: false, categories: false}}
    const [selectedFeatures, setSelecetedFeatures] = useState<Record<string, number>>({})
    const [filteredTracks, setFilteredTracks] = useState<TrackClass[] | null>([])
    const [loadingState, setLoadingState] = useState<string>(null)
    const [popularityFilter, setPopularityFilter] = useState<number>(null)
    const [dateRange, setDateRange] = useState<[Date, Date]>(null);
    const [artistsList, setArtistsList] = useState<Artist[]>(null)
    const [artistQuery, setArtistQuery] = useState<string>("")
    const [selectedArtistFilters, setSelectedArtistFilters] = useState<Artist[]>([])


    const setAudioFeatures = async (trackClassList: TrackClass[]) => {
        const response = await fetch("/spotify-data/audio-features", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trackClassList.map(trackClass => trackClass.track))
        })

        if(response.ok){
            // const features: Features[] = await response.json()
            // let startIdx = 0
    
            // for (let feature of features) {
            //     trackClassList[startIdx].audio_features = feature
            //     startIdx += 1
            // }
            // console.log("tracks after changes: ", trackClassList)
        }else{
            //TODO: ERROR HANDLING
        }
       
    }

    // const filterArtistSearch = (tracklist: TrackClass[] )=>{
    //     const artistsInTracklist = Array.from(new Set (tracklist.flatMap((item)=>item.track.artists.flatMap((artist)=>artist.name))))
    //     // setArtistsList(artistsInTracklist)

    //     if(artistQuery && artistQuery.length>0 && artistsList.length>0){
    //         // const filteredArtists = artistsInTracklist.filter((artistName)=>artistName.startsWith(artistQuery))

    //     }


    // }

    const filterByArtist = useCallback((tracklist: TrackClass[] )=>{
        // const artistsInTracklist = Array.from(new Set (tracklist.flatMap((item)=>item.track.artists.flatMap((artist)=>artist.name))))
        // setArtistsList(artistsInTracklist)
        // let i = 0;


        if(selectedArtistFilters&& selectedArtistFilters.length>0){
        
            // const singleArtistList = (i) => tracklist.filter((item)=> item.track.artists.some((artist)=>artist.id === selectedArtistFilters.at(i).id))
            const allArtistTrackList = tracklist.filter((item)=> selectedArtistFilters.some((selectedArtist)=>item.track.artists.some(trackArtist=>trackArtist.id===selectedArtist.id)))
            return allArtistTrackList


            // return filteredTracks
        }

        return tracklist


    },[selectedArtistFilters])
    

    const filterByPopularity = useCallback((tracklist: TrackClass[])=>{
        let filterPlaylist = tracklist
        if(popularityFilter){
            filterPlaylist = filterPlaylist.filter(item=>item.track.popularity >= popularityFilter -2.5 && item.track.popularity <= popularityFilter + 2.5)

        }
        return filterPlaylist


    }, [popularityFilter])


    const filterByDate = useCallback((tracklist: TrackClass[]): TrackClass[] =>{
        let filterPlaylist = tracklist
        if(dateRange && dateRange.length===2){
            let max = dateRange[1];
            let min = dateRange[0];
            const date = new Date()
            console.log("DATE RANGE: ",dateRange)
            if(dateRange[0]>dateRange[1]){
                max = dateRange[0]
                min = dateRange[1]
            }
            filterPlaylist = filterPlaylist.filter((item)=>{
                if(item.track.album.release_date_precision === "day"){
                    const itemReleaseDate = new Date(item.track.album.release_date)
                    return ((itemReleaseDate >= min) && (itemReleaseDate <= max)) ;
                }else if(item.track.album.release_date_precision==="month"){
                    const itemReleaseDate = new Date(`${item.track.album.release_date}-01`)
                    return ((itemReleaseDate >= min) && (itemReleaseDate <= max)) ;
                }else if(item.track.album.release_date_precision==="year"){
                    const itemReleaseDate = new Date(`${item.track.album.release_date}-01-01`)
                    return ((itemReleaseDate >= min) && (itemReleaseDate <= max)) ;
                }else{
                    return false
                }
            })
            return filterPlaylist

        }else{
            return tracklist
        }
    },[dateRange])

    const filterFeatures = useCallback(async () => {

        // if (!trackDataState) {
        //     // setFilteredTracks(allTracks)
        //     return
        // }


        //TODO: Uncomment the below code when application is given a production license, this will allow filetring using audio features endpoint
        // if (trackDataState != null && trackDataState.length > 0) { //runs only TrackData has been initialized
        //     for (let trackData of trackDataState) { //iterates through each TrackData object
        //         if (trackData.audioFeatures) { //checks if audiofeatures have been fetched
        //             console.log("audio features already set")

        //         } else { //runs if audioFeatures have not been set for the tracks in a TrackData object
        //             await setAudioFeatures(trackData.tracks)//fetches audio features for the trackData tracks
        //             // setHasAudioFeatures(true)
        //             trackData.audioFeatures = true
        //             console.log("audio features set")
        //         }
        //     }
        // }

        let filterPlaylist: TrackClass[] = [];
        console.log("FILTER FEATURES")
        if(allTracks){
            filterPlaylist = filterByPopularity(allTracks)
            console.log("POPULAR PLAYLISTS: ", filterPlaylist)
    
            
            filterPlaylist = filterByDate(filterPlaylist)
            console.log("DATE PLAYLISTS: ", filterPlaylist)
    
            filterPlaylist = filterByArtist(filterPlaylist)
            console.log("Artist PLAYLISTS: ", filterPlaylist)
            setFilteredTracks(filterPlaylist)
        }
        



        

        
        //TODO: Uncomment the below code when application is given a production license, this will allow filetring using audio features endpoint
        // for (let feature of currentFilters) { //iterates through keys to of filter names
        //     if (typeof selectedFeatures[feature] === "number") {
        //         if (feature === "key" || feature === "mode" || feature === "time_signature") {
        //             const featureVal = selectedFeatures[feature]
        //             filterPlaylist = filterPlaylist.filter(item => { //redeclares filterplaylist using the filter function
        //                 return item.audio_features[feature] === featureVal  //returns tracks with feature value that are in range of +/-.1 of selecetd value
        //             })
        //         } else if (feature === "tempo" || feature === "loudness") {
        //             const featureVal = selectedFeatures[feature]
        //             filterPlaylist = filterPlaylist.filter(item => { //redeclares filterplaylist using the filter function
        //                 return item.audio_features[feature] >= featureVal - 5 && item.audio_features[feature] <= featureVal + 5  //returns tracks with feature value that are in range of +/-.1 of selecetd value
        //             })
        //         } else {
        //             const featureVal = selectedFeatures[feature] / 100 //sets value of the selected feature
        //             // console.log("feature-val: ",featureVal)
        //             filterPlaylist = filterPlaylist.filter(item => { //redeclares filterplaylist using the filter function
        //                 return item.audio_features[feature] >= featureVal - .075 && item.audio_features[feature] <= featureVal + .075  //returns tracks with feature value that are in range of +/-.1 of selecetd value
        //             })
        //         }
        //     }
        // }
        console.log("filtered playlist", filterPlaylist)
        

    }, [allTracks, filterByArtist, filterByDate, filterByPopularity]);

const context = useMemo(()=>({selectedArtistFilters, setSelectedArtistFilters, artistsList, setArtistsList, artistQuery, setArtistQuery, dateRange, setDateRange, allTracks, setAllTracks, popularityFilter, setPopularityFilter, trackDataState, setTrackDataState, selectedFeatures, setSelecetedFeatures, filteredTracks, setFilteredTracks, filterFeatures, loadingState, setLoadingState}),[selectedArtistFilters, setSelectedArtistFilters, artistsList, setArtistsList, artistQuery, setArtistQuery, dateRange, allTracks, popularityFilter, trackDataState, selectedFeatures, filteredTracks, filterFeatures, loadingState])



    return(
        <TracklistContext.Provider value={context}>
            {children}
        </TracklistContext.Provider>
    )
}

export {TracklistContext}