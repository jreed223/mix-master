import React, { useContext, useEffect, useState } from "react"
// import PlaylistClass from "../../models/playlistClass"
// import { LibraryItem } from '../../models/libraryItems';
import Tracklist from "./TrackComponents/Tracklist";
import TrackClass from "../../models/Tracks";
import { AudioState, NavigationContext } from "../../state_management/NavigationProvider";
import { DraftingContext } from "../../state_management/DraftingPaneProvider";
import { TracklistContext } from "../../state_management/TracklistProvider";
interface SelectedPlaylistContainerProps {


}

export interface TrackData {
    tracks: TrackClass[],
    audioFeatures: boolean,
    categories: boolean,


}

const SelectedPlaylistContainer: React.FC<SelectedPlaylistContainerProps> = () => {

    const {stagingState, currentAudio, setCurrentAudio} = useContext(NavigationContext)

    const {isMaxDraftView, 

        displayFeatureMenu, 
} = useContext(DraftingContext)

const {selectedLibraryItem, stagedPlaylist, setStagedPlaylist, stagedPlaylistState,
    setStagedPlaylistState,} = useContext(NavigationContext)


    const {allTracks,
        setAllTracks,
        trackDataState,
        setTrackDataState,
        selectedFeatures,
        filteredTracks,
        setFilteredTracks,
        filterFeatures, loadingState, setLoadingState} = useContext(TracklistContext)

    const [selectedTracks, setSelectedTracks] = useState<TrackClass[]>([])
    const [nextTracks, setNextTracks] = useState<TrackClass[]>(null)
    // const [loadingState, setLoadingState] = useState<String>(null)

    const addStagedItems =(items:TrackClass[])=>{
        const newStagedPlaylist = stagedPlaylist.concat(items)
        setStagedPlaylist(newStagedPlaylist)
        setStagedPlaylistState(stagedPlaylistState.concat([newStagedPlaylist]))
        console.log("Added items: ",items)
        console.log("new Staged Playlist: ",newStagedPlaylist)
        console.log(stagedPlaylistState)


    }

    //**Fetches selected playlists tracks if not already fetched*/
    useEffect(() => {
        // setSelectAllChecked(false)
        setTrackDataState(null)
        setFilteredTracks([])
        setSelectedTracks([])
        setLoadingState("loading")

        let allTracks: TrackClass[] = []
        console.log("ITEMMMM: ",selectedLibraryItem)
        

        if (selectedLibraryItem && !selectedLibraryItem?.trackDataState) {
            console.log("setcurrent tracks block 1: ", selectedLibraryItem.tracks)
            selectedLibraryItem.setTracks().then(() => {
                console.log("library item trackDataState after setting: ", selectedLibraryItem.trackDataState)
                setTrackDataState(selectedLibraryItem.trackDataState)
                allTracks = selectedLibraryItem.trackDataState.flatMap(trackData => trackData.tracks)
                setAllTracks(allTracks)
                setLoadingState(null)

            })
            // .then(()=>{
            //     if(!currentAudio){
            //         const audio = new Audio(selectedLibraryItem?.tracks?.at(0).track.preview_url)
            //         const initAudioState: AudioState = {
            //             url:selectedLibraryItem?.tracks?.at(0).track.preview_url,
            //             audio: audio,
            //             audioDetails: {
            //                 trackId: selectedLibraryItem?.tracks?.at(0).track.id,
            //                 artist: selectedLibraryItem?.tracks?.at(0).track.artists[0].name,
            //                 title: selectedLibraryItem?.tracks?.at(0).track.name,
            //                 collection: selectedLibraryItem
            
            //             }
            //         }
            //         setCurrentAudio(initAudioState)
            //     }
            // })
        } else if (selectedLibraryItem && selectedLibraryItem?.trackDataState) {
            console.log("setcurrent tracks block 5: ", selectedLibraryItem.tracks)

            setTrackDataState(selectedLibraryItem.trackDataState)
            allTracks = selectedLibraryItem.trackDataState.flatMap(track => track.tracks)
            setAllTracks(allTracks)
            setLoadingState(null)

            // if(!currentAudio){
            //     const audio = new Audio(selectedLibraryItem?.tracks?.at(0).track.preview_url)
            //     const initAudioState: AudioState = {
            //         url:selectedLibraryItem?.tracks?.at(0).track.preview_url,
            //         audio: audio,
            //         audioDetails: {
            //             trackId: selectedLibraryItem?.tracks?.at(0).track.id,
            //             artist: selectedLibraryItem?.tracks?.at(0).track.artists[0].name,
            //             title: selectedLibraryItem?.tracks?.at(0).track.name,
            //             collection: selectedLibraryItem
        
            //         }
            //     }
            //     setCurrentAudio(initAudioState)
            // }
        }



    }, [selectedLibraryItem, setAllTracks, setFilteredTracks, setLoadingState, setTrackDataState])


    let isFeatureFilterSelected = Object.values(selectedFeatures).some(featureVal => typeof featureVal === "number")

    //** FIlters the selected playlist if the audio featrues have been set*/
    useEffect(() => {
        if (trackDataState != null && isFeatureFilterSelected) {
            setLoadingState("filtering")
            // console.log(featureFilters.at(-1))
            console.log("useEffect run for filtFeatures")
            // console.log("currentTracks: ", currentTracks)
            filterFeatures().then(() => setLoadingState(null))


        } else {
            setFilteredTracks(allTracks)
        }
        



    }, [selectedFeatures, trackDataState, filterFeatures, allTracks, isFeatureFilterSelected, setFilteredTracks, setLoadingState])

    useEffect(()=>{
        if(allTracks&&!currentAudio){
            const audio = new Audio(selectedLibraryItem?.tracks?.at(0).track.preview_url)
            const initAudioState: AudioState = {
                url:selectedLibraryItem?.tracks?.at(0).track.preview_url,
                audio: audio,
                audioDetails: {
                    trackId: selectedLibraryItem?.tracks?.at(0).track.id,
                    artist: selectedLibraryItem?.tracks?.at(0).track.artists[0].name,
                    title: selectedLibraryItem?.tracks?.at(0).track.name,
                    track: selectedLibraryItem?.tracks.at(0)
    
                }
            }
            setCurrentAudio(initAudioState)
        }
    },[allTracks, currentAudio, selectedLibraryItem, setCurrentAudio])


    useEffect(() => {
        if (nextTracks) {
            const newTrackData = [{ tracks: nextTracks, audioFeatures: false, categories: false }]
            setTrackDataState(trackDataState.concat(newTrackData))
            setAllTracks(allTracks.concat(nextTracks))
            console.log("nextTracks: ", nextTracks)
        }
        setNextTracks(null)
    }, [allTracks, nextTracks, setAllTracks, setTrackDataState, trackDataState])


    let displayedItems: TrackClass[]

    allTracks ? displayedItems = allTracks.filter(trackClass => {
        const staged = stagedPlaylist?.some(item => item.track.id === trackClass.track.id)
        const filtered = isFeatureFilterSelected ? !filteredTracks?.some(filteredTrackClass => filteredTrackClass.track.id === trackClass.track.id) : false
        // console.log(`staged: ${staged}, filtered: ${filtered}`)
        return !staged && !filtered
    }) : displayedItems = []

    const selectAllclicked = () => {
        const selections = displayedItems
        const newSelections: TrackClass[] = selections.filter((selection) => !selectedTracks.some((item) => item.track.id === selection.track.id))
        const allSelected = selectedTracks.concat(newSelections)
        setSelectedTracks(allSelected)
    }

    const deselectAllClicked = () => {
        const selections: TrackClass[] = displayedItems
        const removedSelections: TrackClass[] = selections.filter((selection) => selectedTracks.some((item) => item.track.id === selection.track.id))
        const allDeselected = selectedTracks.filter(item => !removedSelections.some((selection) => selection.track.id === item.track.id))
        setSelectedTracks(allDeselected)
    }





    const stageSelectedDisplayedTracks = () => {
        if (filteredTracks && filteredTracks.length > 0) {

            const selectedDisplayed = (selectedTracks.filter(selectedItem => filteredTracks.some(filteredItem => selectedItem.track.id === filteredItem.track.id)))
            addStagedItems(selectedDisplayed);

            const selectedHidden = (selectedTracks.filter(selectedItem => !filteredTracks.some(filteredItem => selectedItem.track.id === filteredItem.track.id)))
            setSelectedTracks(selectedHidden)
        } else {
            console.log("selected Library items: ", selectedTracks)
            addStagedItems(selectedTracks);
            setSelectedTracks([])
        }


    }


        return (
            <div className="search-filter-container new-playlist" style={stagingState === "open" ? { borderRight: "2px solid #141414", transition: "1s", flex: displayFeatureMenu && !isMaxDraftView ? 2 : 1, display: 'flex', flexDirection:"column" } : { borderRight: "0px solid #141414", transition: "1s" }} id="search-filter-div" >
                <div style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#141414",
                    zIndex: 1,
                    display:"flex",
                    flexDirection:"column"
                    
                }}>
                    <div style={{margin:"auto", flex: "1"}}>
                    <button style={{margin:"auto 10px", flex: "1", borderRadius:'15px'}} onClick={() => { selectAllclicked(); }} value={"SelectAll"}>Select All</button>
                    <button style={{margin:"auto 10px", flex: "1", borderRadius:'15px'}} onClick={() => { deselectAllClicked() }}>Deselect All</button>
                    <button style={{margin:"auto 10px", flex: "1", borderRadius:'15px'}} onClick={() => { stageSelectedDisplayedTracks(); }}>Add Items</button>
                    {/* {isFeatureFilterSelected && loadingState === "filtering" 
                    ?(<p>Filtering Tracks...</p>) 
                    : (<></>)} */}
                    </div>
                    <h3 style={{margin:"5px 15px", textAlign:'center'}}>{selectedLibraryItem?.name}</h3>
                </div>{loadingState==="loading"
                    ?<div className="search-filter-container new-playlist" id="search-filter-div" >
                        <p>loading...</p>
                    </div>
                    :<div style={{overflowY: 'auto'}}>
                        
                        <Tracklist tracklistArea="selected-playlist" selectedLibraryItems={selectedTracks} setSelectedLibraryItems={setSelectedTracks} draftTracks={addStagedItems}></Tracklist>
                        
                    </div>}
                {selectedLibraryItem?.next ?
                    <div style={{}}>
                        {
                            loadingState === "loadingNext" ?
                                <button disabled={true} style={{ width: `100%`, overflowX: "hidden", padding: 0 }}>Loading...</button> :
                                <button onClick={() => {
                                    setLoadingState("loadingNext")
                                    selectedLibraryItem?.getNextTracks().then((newTracks) => { setNextTracks(newTracks); setLoadingState(null) })
                                }}
                                    style={{ width: `100%`, overflowX: "hidden", padding: 0 }}>
                                    More
                                </button>
                        }
                    </div> :
                    <></>}
            </div>
        )


}

export default SelectedPlaylistContainer