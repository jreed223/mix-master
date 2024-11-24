import React, { createContext, useCallback, useMemo, useState } from "react"
import TrackClass from "../models/Tracks"
import { TrackData } from "../ui_components/DraftingPaneComponents/SelectedPlaylistArea"
import { Features } from "../../server/types"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
// import { Button } from "@mui/material";


export type ViewName = 'Dashboard'|"Liked Playlists"|"User Playlists"|"Liked Albums"

    const TracklistContext = createContext(null)


export default function TracklistProvider({children}){
    const [allTracks, setAllTracks] = useState<TrackClass[]>(null)
    const [trackDataState, setTrackDataState] = useState<TrackData[]>(null) //{batch1: {Tracks = [], audioFeatures: false, categories: false}}
    const [selectedFeatures, setSelecetedFeatures] = useState<Record<string, number>>({})
    const [filteredTracks, setFilteredTracks] = useState<TrackClass[] | null>([])
    const [loadingState, setLoadingState] = useState<string>(null)

    
    const setAudioFeatures = async (trackClassList: TrackClass[]) => {
        const response = await fetch("/spotify-data/audio-features", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trackClassList.map(trackClass => trackClass.track))
        })

        const features: Features[] = await response.json()
        let startIdx = 0

        for (let feature of features) {
            trackClassList[startIdx].audio_features = feature
            startIdx += 1
        }
        console.log("tracks after changes: ", trackClassList)
    }


    const filterFeatures = useCallback(async () => {
        if (!trackDataState) {
            setFilteredTracks([])
            return
        }

        if (trackDataState != null && trackDataState.length > 0) { //runs only TrackData has been initialized
            for (let trackData of trackDataState) { //iterates through each TrackData object
                if (trackData.audioFeatures) { //checks if audiofeatures have been fetched
                    console.log("audio features already set")

                } else { //runs if audioFeatures have not been set for the tracks in a TrackData object
                    await setAudioFeatures(trackData.tracks)//fetches audio features for the trackData tracks
                    // setHasAudioFeatures(true)
                    trackData.audioFeatures = true
                    console.log("audio features set")
                }
            }
        }

        let filterPlaylist = allTracks
        const currentFilters = Object.keys(selectedFeatures)

        for (let feature of currentFilters) { //iterates through keys to of filter names
            if (typeof selectedFeatures[feature] === "number") {
                if (feature === "key" || feature === "mode" || feature === "time_signature") {
                    const featureVal = selectedFeatures[feature]
                    filterPlaylist = filterPlaylist.filter(item => { //redeclares filterplaylist using the filter function
                        return item.audio_features[feature] === featureVal  //returns tracks with feature value that are in range of +/-.1 of selecetd value
                    })
                } else if (feature === "tempo" || feature === "loudness") {
                    const featureVal = selectedFeatures[feature]
                    filterPlaylist = filterPlaylist.filter(item => { //redeclares filterplaylist using the filter function
                        return item.audio_features[feature] >= featureVal - 5 && item.audio_features[feature] <= featureVal + 5  //returns tracks with feature value that are in range of +/-.1 of selecetd value
                    })
                } else {
                    const featureVal = selectedFeatures[feature] / 100 //sets value of the selected feature
                    // console.log("feature-val: ",featureVal)
                    filterPlaylist = filterPlaylist.filter(item => { //redeclares filterplaylist using the filter function
                        return item.audio_features[feature] >= featureVal - .075 && item.audio_features[feature] <= featureVal + .075  //returns tracks with feature value that are in range of +/-.1 of selecetd value
                    })
                }
            }
        }
        console.log("filtered playlist", filterPlaylist)
        setFilteredTracks(filterPlaylist)

    }, [allTracks, selectedFeatures, setFilteredTracks, trackDataState]);

const context = useMemo(()=>({allTracks, setAllTracks, trackDataState, setTrackDataState, selectedFeatures, setSelecetedFeatures, filteredTracks, setFilteredTracks, filterFeatures, loadingState, setLoadingState}),[allTracks, filterFeatures, filteredTracks, loadingState, selectedFeatures, trackDataState])



    return(
        <TracklistContext.Provider value={context}>
            {children}
        </TracklistContext.Provider>
    )
}

export {TracklistContext}