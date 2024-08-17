import React, { useCallback, useEffect, useState } from "react"
import { Features, PlaylistItem, Track } from '../../server/types';
import TrackCard from "./TrackCard"
import PlaylistClass from "../models/playlistClass"
import Library from "../models/libraryItems"
import { LibraryItem } from '../models/libraryItems';
interface SelectedPlaylistContainerProps{
    libraryItem: Library|null
    stagedPlaylistItems: Track[]|null
    onSelectedItems: (selectedItems: Track[]) => void
    onGetNextItems: ()=>void
    featureFilters: Record<string, number>
    // filteredTracks: Track[]

}

interface TrackData{
    tracks:Track[], 
    audioFeatures: boolean, 
    categories: boolean
}

const SelectedPlaylistContainer:React.FC<SelectedPlaylistContainerProps>=(props: SelectedPlaylistContainerProps)=>{


const [selectedLibraryItems, setSelectedLibraryItems] = useState<Track[]>([])
const [filteredTracks, setFilteredTracks] = useState<Track[]|null>(null)

const [nextTracks, setNextTracks] = useState<Track[]>(null)
//const [currentTracks, setCurrentTracks] = useState<Track[]|null>(null)
//const [audioFeaturesSet, setAudioFeaturesSet] = useState<boolean>(false)
const [trackDataState, setTrackDataState] = useState<TrackData[]>(null) //{batch1: {Tracks = [], audioFeatures: false, categories: false}}
const [allTracks, setAllTracks] = useState<Track[]>(null)


const editSelectedItemList = (e: React.ChangeEvent<HTMLInputElement>,selectedItem: Track)=>{
    if(e.target.checked){
        setSelectedLibraryItems(selectedLibraryItems.concat([selectedItem]))

    }else{
        setSelectedLibraryItems(selectedLibraryItems.filter(item=>item!== selectedItem))
    }
    // console.log(selectedPlaylistItems)
}

const setAudioFeatures=async (tracks:Track[])=>{
    console.log("tracks when passed to setFeatures: ", tracks)
    // if(tracks&&tracks.length>100){
    //     let startIdx = 0
    //     let endIdx = 99

    //     while(startIdx<tracks.length){
    //         //TODO: Edit Audio features function to receive Track[]
    //         let playlistItemsSubset:Track[] = tracks.slice(startIdx, endIdx+1)
    //         const features = await fetch("/spotify-data/audio-features", {
    //             method: "POST",
    //             headers: {
    //                 'Content-Type': 'plain/text'
    //               },
    //             body: JSON.stringify(playlistItemsSubset)
    //         }).then(async (response)=>{
    //             return await response.json()
    //         })
    //         //console.log("audiofeatures response: ", response)
    //         //const features = await response.json() 

    //         console.log("audiofeatures response.json() : ", features)


    //         console.log("subset: ", playlistItemsSubset)

    //         for(let feature of features){
    //             tracks[startIdx].audio_features = feature
    //             startIdx+=1
    //             // console.log(`${this.tracks[startIdx]}, Features: ${feature}`)
    //             // console.log(`${this.tracks[startIdx].track.name}, Features: ${feature}`)
    //         }
    //         startIdx=endIdx
    //         endIdx+= 99
            
    //     }
    //     console.log("tracks after changes: ", tracks)


    // }else{
        const response = await fetch("/spotify-data/audio-features", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(tracks)
        })

        const features:Features[] = await response.json() 
        let startIdx = 0

        for(let feature of features){
            tracks[startIdx].audio_features = feature
            startIdx+=1
      
        }
        //setCurrentTracks(tracks)
        console.log("tracks after changes: ", tracks)




    // }
    

}



const filterFeatures2  = useCallback(async ()=>{
    setFilteredTracks(null)

    if(!trackDataState){
        setFilteredTracks(null)
        return
    }
    //console.log("current tracks in filter: ", currentTracks)
    if(trackDataState!=null && trackDataState.length>0){
        for(let trackData of trackDataState){
            if(trackData.audioFeatures){ //checks if audiofeatures have been fetched
                // setHasAudioFeatures(true)
                console.log("audio features already set")
    
                
                
            }else{
                await setAudioFeatures(trackData.tracks) //fetches audio features
                    // setHasAudioFeatures(true)
                    trackData.audioFeatures = true
                    console.log("audio features set")
    
            }
        }

    }
    let filterPlaylist = []


    for(let trackData of trackDataState){
        filterPlaylist = filterPlaylist.concat(trackData.tracks)
    }


    if(trackDataState){ 
        const currentFilters = Object.keys(props.featureFilters) 

            for(let feature of currentFilters){ //iterates through keys to of filter names
                if(typeof props.featureFilters[feature] === "number"){

                    const featureVal = props.featureFilters[feature]/100 //sets value of the selected feature
                    // console.log("feature-val: ",featureVal)
                    filterPlaylist = filterPlaylist.filter(item=> { //redeclares filterplaylist using the filter function

                    return item.audio_features[feature]>=featureVal-.1&&item.audio_features[feature]<=featureVal+.1  //returns tracks with feature value that are in range of +/-.1 of selecetd value
                    })
                }
            }
            console.log("filtered playlist", filterPlaylist)
            setFilteredTracks(filterPlaylist) 
    }
    else{
        setFilteredTracks(null)
        console.log("no feature vals")
    }

}, [props.featureFilters, trackDataState]);


        //**Fetches selected playlists tracks if not already fetched*/
        useEffect(()=>{

            setTrackDataState(null)
            setFilteredTracks(null)
            //setAudioFeaturesSet(false)
            // console.log("set tracklist block",selectedPlaylist)
            let allTracks :Track[]= []

            if(props.libraryItem && !props.libraryItem?.trackDataState){
                // console.log("setcurrent tracks block 1: ", selectedPlaylist.tracks)
                props.libraryItem.setTracks().then(()=>{
                    console.log("library item trackDataState after setting: ", props.libraryItem.trackDataState)
                    //setCurrentTracks(props.libraryItem.trackDataState[0].tracks)
                    setTrackDataState(props.libraryItem.trackDataState)
                    allTracks = props.libraryItem.trackDataState.flatMap(track=>track.tracks)
                    setAllTracks(allTracks)
                    // setSelectedPlaylist(selectedPlaylist)
                // console.log("current tracklist set: ", selectedPlaylist)
                }
                )
            }else if (props.libraryItem && props.libraryItem?.trackDataState){
                // console.log("setcurrent tracks block 2: ", selectedPlaylist.tracks)
                //setTrackDataState()
                setTrackDataState(props.libraryItem.trackDataState)
                allTracks = props.libraryItem.trackDataState.flatMap(track=>track.tracks)
                setAllTracks(allTracks)

                //setCurrentTracks(props.libraryItem.trackDataState[0].tracks)
            }else{
                // console.log("setcurrent tracks block 3")
    
            }
    
        }, [props.libraryItem])


        let isFeatureFilterSelected = Object.values(props.featureFilters).some(featureVal=>typeof featureVal === "number")

        //** FIlters the selected playlist if the audio featrues have been set*/
        useEffect(()=>{


    
            if(trackDataState!=null  && isFeatureFilterSelected){
                // console.log(featureFilters.at(-1))
                console.log("useEffect run for filtFeatures")
                // console.log("currentTracks: ", currentTracks)
                filterFeatures2()
            }else if(trackDataState!=null  && !isFeatureFilterSelected){
                setFilteredTracks(allTracks)
            }
        }, [props.featureFilters, trackDataState, filterFeatures2, allTracks, isFeatureFilterSelected])

        useEffect(()=>{
            if(nextTracks){
                const newTrackData = [{tracks: nextTracks, audioFeatures: false, categories: false}]
                setTrackDataState(trackDataState.concat(newTrackData))
                setAllTracks(allTracks.concat(nextTracks))
                console.log("nextTracks: ", nextTracks)
            }
            setNextTracks(null)
        }, [allTracks, nextTracks, trackDataState])


const stageSelectedDisplayedTracks = () =>{
    if(filteredTracks.length>0){
    const selectedDisplayed = (selectedLibraryItems.filter(selectedItem=>filteredTracks.some(filteredItem=>selectedItem.id === filteredItem.id)))
    // console.log("selected displayed tracks: ", selectedDisplayed)
    props.onSelectedItems(selectedDisplayed); 
    const selectedHidden = (selectedLibraryItems.filter(selectedItem=>!filteredTracks.some(filteredItem=>selectedItem.id === filteredItem.id)))
    // console.log("selected hidden tracks: ", selectedHidden)
    setSelectedLibraryItems(selectedHidden)
    }else{
    props.onSelectedItems(selectedLibraryItems);
    setSelectedLibraryItems([])
    }
    
}

const getNextTracks = ()=>{

}

// const TrackComponent = React.memo(({track})=>{
//     return(
//         <TrackCard track={track} onSelectedTrack={editSelectedItemList} displayHidden={true} checked={false}></TrackCard>
//         )
// })


// console.log("tracks:", props.playlist?.tracks )
    if(allTracks){
        // console.log(props.audioFeatureFilters)
        // console.log("props playlist tracks: ",props.playlist.tracks[134])
        const unStagedItems = allTracks.filter(unStagedItem=>!props.stagedPlaylistItems.some(stagedItem => stagedItem.id === unStagedItem.id))
        console.log("display block 2")

        // for(let trackData of trackDataState){
        //     if(trackData.audioFeatures){
        //         trackData.tracks.map(singleTrack=>{
                            
        //             const staged = !unStagedItems.includes(singleTrack)
        //             const filtered = !filteredTracks.some(filteredTrack => filteredTrack.id === singleTrack.id)
        //             //const stagedOrFiltered = staged||filtered
        //             if(staged){
        //                 console.log("stagedItem rendered")
        //                 return(
        //                     <TrackCard track={singleTrack} onSelectedTrack={editSelectedItemList} displayHidden={true} checked={false}></TrackCard>
        //                     )
        //             }else{
        //                 console.log("unstaged Item rendered")
        //                 // console.log(`single track: ${JSON.stringify(singleTrack)} in filtered Track? ${filteredTracks.includes(singleTrack)}`)
        //                 return(
        //                     <TrackCard track={singleTrack} onSelectedTrack={editSelectedItemList} displayHidden={filtered} checked={null}></TrackCard>
        //                     )
        //             }
                    
        //     })
        //     }
        // }


        return(
            <div className="search-filter-container new-playlist" id="search-filter-div" >
                <button onClick={()=>{stageSelectedDisplayedTracks();}}>Add Items</button>
                {isFeatureFilterSelected && !filteredTracks?
                    (
                        <p>Filtering Tracks...</p>
                        ):
                    
                    // hasAudioFeatures?
                        allTracks.map(singleTrack=>{

                            let filtered:boolean
                            
                            const staged = !unStagedItems.includes(singleTrack)
                             isFeatureFilterSelected?filtered = !filteredTracks.some(filteredTrack => filteredTrack.id === singleTrack.id):filtered=false
                            //const stagedOrFiltered = staged||filtered
                            if(staged){
                                console.log("stagedItem rendered")
                                return(
                                    <TrackCard track={singleTrack} onSelectedTrack={editSelectedItemList} displayHidden={true} checked={false}></TrackCard>
                                    )
                            }else{
                                console.log("unstaged Item rendered")
                                // console.log(`single track: ${JSON.stringify(singleTrack)} in filtered Track? ${filteredTracks.includes(singleTrack)}`)
                                return(
                                    <TrackCard track={singleTrack} onSelectedTrack={editSelectedItemList} displayHidden={filtered} checked={null}></TrackCard>
                                    )
                            }
                            
                    })
                    // :
                    //     (
                    //     <p>Filtering Tracks...</p>
                    //     )
            }
                {/* {filteredTracks?
                    // hasAudioFeatures?
                        allTracks.map(singleTrack=>{
                            
                            const staged = !unStagedItems.includes(singleTrack)
                            const filtered = !filteredTracks.some(filteredTrack => filteredTrack.id === singleTrack.id)
                            //const stagedOrFiltered = staged||filtered
                            if(staged){
                                console.log("stagedItem rendered")
                                return(
                                    <TrackCard track={singleTrack} onSelectedTrack={editSelectedItemList} displayHidden={true} checked={false}></TrackCard>
                                    )
                            }else{
                                console.log("unstaged Item rendered")
                                // console.log(`single track: ${JSON.stringify(singleTrack)} in filtered Track? ${filteredTracks.includes(singleTrack)}`)
                                return(
                                    <TrackCard track={singleTrack} onSelectedTrack={editSelectedItemList} displayHidden={filtered} checked={null}></TrackCard>
                                    )
                            }
                            
                    })
                    :
                        (
                        <p>Filtering Tracks...</p>
                        )
                } */}

                <button onClick={()=>props.libraryItem.getNextTracks().then((newTracks)=>{setNextTracks(newTracks)})}style={{position: "absolute", bottom: 0, width: `50%`, overflowX: "hidden", padding: 0}}>More</button>
            </div>
        )
    }else {
        console.log("display block 3")
        return(
        <div className="search-filter-container new-playlist" id="search-filter-div" >
            <p>Loading Tracks...</p>
        </div>
        )
    }
}

export default SelectedPlaylistContainer