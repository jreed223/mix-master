import React, { Dispatch, ReactElement, SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import { Features, PlaylistItem, Track } from '../../server/types';
import TrackCard, { TrackCardProps } from "./TrackCard"
import PlaylistClass from "../models/playlistClass"
import Library from "../models/libraryItems"
import { LibraryItem } from '../models/libraryItems';
import Tracklist from "./Tracklist";
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
const [filteredTracks, setFilteredTracks] = useState<Track[]|null>([])

const [nextTracks, setNextTracks] = useState<Track[]>(null)

const [trackDataState, setTrackDataState] = useState<TrackData[]>(null) //{batch1: {Tracks = [], audioFeatures: false, categories: false}}
const [allTracks, setAllTracks] = useState<Track[]>(null)
const [loadingState, setLoadingState] = useState<String>(null)








// const editSelectedItemList2 = useCallback((checked: boolean ,selectedItem: Track)=>{
//     if(checked){
//         // const lst = selectedLibraryItems.concat([selectedItem])
//         console.log("track card checked: ", console.log(selectedLibraryItems))

//         setSelectedLibraryItems(selectedLibraryItems.concat([selectedItem]))

//     }else{
//         console.log("track card unchecked: ", console.log(selectedLibraryItems.filter(item=>item!== selectedItem)))
//         setSelectedLibraryItems(selectedLibraryItems.filter(item=>item!== selectedItem))
//     }
//     // console.log(selectedPlaylistItems)
// }, [selectedLibraryItems])

const setAudioFeatures=async (tracks:Track[])=>{
  

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
        console.log("tracks after changes: ", tracks)

}


const filterFeatures2  = useCallback(async ()=>{
    if(!trackDataState){
        setFilteredTracks([])
        return
    }

    
    if(trackDataState!=null && trackDataState.length>0){ //runs only TrackData has been initialized
        for(let trackData of trackDataState){ //iterates through each TrackData object
            if(trackData.audioFeatures){ //checks if audiofeatures have been fetched
                console.log("audio features already set")

            }else{ //runs if audioFeatures have not been set for the tracks in a TrackData object
                await setAudioFeatures(trackData.tracks) //fetches audio features for the trackData tracks
                    // setHasAudioFeatures(true)
                    trackData.audioFeatures = true
                    console.log("audio features set")
    
            }
        }

    }
    let filterPlaylist = allTracks

    
        const currentFilters = Object.keys(props.featureFilters) 

            for(let feature of currentFilters){ //iterates through keys to of filter names
                if(typeof props.featureFilters[feature] === "number"){
                    if(feature==="key"||feature==="mode"||feature==="time_signature"){

                        const featureVal = props.featureFilters[feature]

                        filterPlaylist = filterPlaylist.filter(item=> { //redeclares filterplaylist using the filter function

                            return item.audio_features[feature]===featureVal  //returns tracks with feature value that are in range of +/-.1 of selecetd value
                            })
                        
                    }else if(feature==="tempo"||feature==="loudness"){

                        const featureVal = props.featureFilters[feature]

                        filterPlaylist = filterPlaylist.filter(item=> { //redeclares filterplaylist using the filter function

                            return item.audio_features[feature]>=featureVal-5&&item.audio_features[feature]<=featureVal+5  //returns tracks with feature value that are in range of +/-.1 of selecetd value
                            })
                        
                    }else{

                        const featureVal = props.featureFilters[feature]/100 //sets value of the selected feature
                        // console.log("feature-val: ",featureVal)
                        filterPlaylist = filterPlaylist.filter(item=> { //redeclares filterplaylist using the filter function
    
                        return item.audio_features[feature]>=featureVal-.1&&item.audio_features[feature]<=featureVal+.1  //returns tracks with feature value that are in range of +/-.1 of selecetd value
                        })

                    }

                }
            }
            console.log("filtered playlist", filterPlaylist)
            setFilteredTracks(filterPlaylist) 



}, [allTracks, props.featureFilters, trackDataState]);



        //**Fetches selected playlists tracks if not already fetched*/
        useEffect(()=>{
            // setSelectAllChecked(false)
            setTrackDataState(null)
            setFilteredTracks([])
            setSelectedLibraryItems([])
            setLoadingState("loading")


            let allTracks :Track[]= []

            if(props.libraryItem && !props.libraryItem?.trackDataState){
                // console.log("setcurrent tracks block 1: ", selectedPlaylist.tracks)
                props.libraryItem.setTracks().then(()=>{
                    console.log("library item trackDataState after setting: ", props.libraryItem.trackDataState)
                    setTrackDataState(props.libraryItem.trackDataState)
                    allTracks = props.libraryItem.trackDataState.flatMap(track=>track.tracks)
                    setAllTracks(allTracks)
                    setLoadingState(null)

                }
                )
            }else if (props.libraryItem && props.libraryItem?.trackDataState){
                setTrackDataState(props.libraryItem.trackDataState)
                allTracks = props.libraryItem.trackDataState.flatMap(track=>track.tracks)
                setAllTracks(allTracks)
                setLoadingState(null)

            }
    
        }, [props.libraryItem])


        let isFeatureFilterSelected = Object.values(props.featureFilters).some(featureVal=>typeof featureVal === "number")

        //** FIlters the selected playlist if the audio featrues have been set*/
    useEffect(()=>{


    
            if(trackDataState!=null  && isFeatureFilterSelected){
                setLoadingState("filtering")
                // console.log(featureFilters.at(-1))
                console.log("useEffect run for filtFeatures")
                // console.log("currentTracks: ", currentTracks)
                filterFeatures2().then(()=>setLoadingState(null))
               

            }else{
                setFilteredTracks(allTracks)
            }



        }, [props.featureFilters, trackDataState, filterFeatures2, allTracks, isFeatureFilterSelected, ])

    
    useEffect(()=>{
            if(nextTracks){
                const newTrackData = [{tracks: nextTracks, audioFeatures: false, categories: false}]
                setTrackDataState(trackDataState.concat(newTrackData))
                setAllTracks(allTracks.concat(nextTracks))
                console.log("nextTracks: ", nextTracks)
            }
            setNextTracks(null)
        }, [allTracks, nextTracks, trackDataState])








// allTracks&&props.stagedPlaylistItems? unStagedItems = allTracks.filter(unStagedItem=>!props.stagedPlaylistItems.some(stagedItem => stagedItem.id === unStagedItem.id)): unStagedItems=[]



let displayedItems: Track[]

    allTracks?displayedItems = allTracks.filter(track=>{
        const staged  = props.stagedPlaylistItems.includes(track)
        const filtered =  isFeatureFilterSelected?!filteredTracks.some(filteredTrack => filteredTrack.id === track.id):false
        // console.log(`staged: ${staged}, filtered: ${filtered}`)
    
    
        return !staged&&!filtered
    }):displayedItems = []

const selectAllclicked = ()=>{
    

        const selections = displayedItems
        const newSelections : Track[] = selections.filter((selection)=>!selectedLibraryItems.some((item)=>item.id ===selection.id))
        const allSelected = selectedLibraryItems.concat(newSelections)
        setSelectedLibraryItems(allSelected)
}

const deselectAllClicked = ()=>{
    const selections: Track[] = displayedItems
    const removedSelections : Track[] =  selections.filter((selection)=>selectedLibraryItems.some((item)=>item.id ===selection.id))
    const allDeselected = selectedLibraryItems.filter(item=>!removedSelections.some((selection)=>selection.id === item.id))
    setSelectedLibraryItems(allDeselected)
}





const stageSelectedDisplayedTracks = () =>{
    
   


    if(filteredTracks&&filteredTracks.length>0){

    const selectedDisplayed = (selectedLibraryItems.filter(selectedItem=>filteredTracks.some(filteredItem=>selectedItem.id === filteredItem.id)))
    props.onSelectedItems(selectedDisplayed); 

    // console.log("selected displayed tracks: ", selectedDisplayed)
    const selectedHidden = (selectedLibraryItems.filter(selectedItem=>!filteredTracks.some(filteredItem=>selectedItem.id === filteredItem.id)))
    // console.log("selected hidden tracks: ", selectedHidden)
    setSelectedLibraryItems(selectedHidden)
    }else{
        console.log("selected Library items: ", selectedLibraryItems)
    props.onSelectedItems(selectedLibraryItems);
    setSelectedLibraryItems([])
    }

}




    if(loadingState==="loading"){

        return(
        <div className="search-filter-container new-playlist" id="search-filter-div" >
            <p>loading...</p>
        </div>
        )
    }else if(allTracks){

        return(
            <div className="search-filter-container new-playlist" id="search-filter-div" >
                <div style={{
                    position:"sticky",
                    top: 0,
                    backgroundColor: "#141414",
                }}>
                {isFeatureFilterSelected && loadingState==="filtering"?
                    
                    (
                        <p>Filtering Tracks...</p>
                        ):(
                        <> 
                        <button onClick={(e)=>{selectAllclicked();}} value={"SelectAll"}>Select All</button>
                        <button onClick={()=>{deselectAllClicked()}}>Deselect All</button>
                        <button onClick={()=>{stageSelectedDisplayedTracks();}}>Add Items</button>

                        </>
                        
                        )}
                </div>

                <Tracklist allTracks={allTracks} selectedLibraryItems={selectedLibraryItems} stagedTracks={props.stagedPlaylistItems} setSelectedLibraryItems={setSelectedLibraryItems}  filteredTracks={filteredTracks}></Tracklist>



                {props.libraryItem.next?
                <div className="track-card" style={{position: "sticky", bottom:0}}>
                    {
                    loadingState==="loadingNext"?
                        <button disabled={true} style={{width: `100%`, overflowX: "hidden", padding: 0}}>Loading...</button>:
                            <button onClick={()=>{
                                setLoadingState("loadingNext")
                                props.libraryItem.getNextTracks().then((newTracks)=>{setNextTracks(newTracks); setLoadingState(null)})
                                }}
                                    style={{width: `100%`, overflowX: "hidden", padding: 0}}>
                                More
                            </button>
                    }
                </div>:
                <></>}
            </div>
        )
    
    }

}

export default SelectedPlaylistContainer