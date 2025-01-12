import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
// import PlaylistClass from "../../models/playlistClass"
// import { LibraryItem } from '../../models/libraryItems';
import Tracklist from "../TrackComponents/Tracklist";
import TrackClass from "../../../models/Tracks";
import { ViewContext } from "../../../state_management/ViewProvider";
import { DraftingContext } from "../../../state_management/DraftingPaneProvider";
import { TracklistContext } from "../../../state_management/TracklistProvider";
import { Artist } from "../../../../server/types";
import { AudioContext, AudioContextType } from "../../../state_management/AudioProvider";
interface SelectedPlaylistContainerProps {


}

export interface TrackData {
    tracks: TrackClass[],
    audioFeatures: boolean,
    categories: boolean,


}

const SelectedPlaylistContainer: React.FC<SelectedPlaylistContainerProps> = () => {

    const { isMaxDraftView, isMobile} = useContext(ViewContext)
    const {currentAudio, setCurrentAudio, } =  useContext<AudioContextType>(AudioContext)

    const { 
        stagingState,
        selectedLibraryItem, stagedPlaylist, setStagedPlaylist, stagedPlaylistState,
    setStagedPlaylistState,
        displayFeatureMenu, 
} = useContext(DraftingContext)

const {popularityFilter, dateRange, setSelectedArtistFilters, artistQuery, artistsList, setArtistsList} = useContext(TracklistContext)

// const [artistsList, setArtistsList] = useState<Artist[]>(null)
// const [artistQuery, setArtistQuery] = useState<string>(null)


    const {allTracks,
        setAllTracks,
        trackDataState,
        setTrackDataState,
        selectedFeatures,
        filteredTracks,
        setFilteredTracks,
        filterFeatures, loadingState, setLoadingState, selectedArtistFilters, setArtistQuery} = useContext(TracklistContext)

    const [selectedTracks, setSelectedTracks] = useState<TrackClass[]>([])
    const [displayedTracks, setDisplayedTracks] = useState<TrackClass[]>([])
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
        setArtistQuery("")
        setSelectedArtistFilters([])
        setArtistsList(null)
        // setAllTracks([])

        let allTracks: TrackClass[] = []
        

        // console.log("ITEMMMM: ",selectedLibraryItem)
        

        if (selectedLibraryItem && !selectedLibraryItem?.trackDataState) {
            console.log("setcurrent tracks block 1: ", selectedLibraryItem.tracks)
            selectedLibraryItem.setTracks().then(() => {
                console.log("library item trackDataState after setting: ", selectedLibraryItem.trackDataState)
                setTrackDataState(selectedLibraryItem.trackDataState)
                allTracks = selectedLibraryItem.trackDataState.flatMap(trackData => trackData.tracks)
                setAllTracks(allTracks)
                let consolidatedList : Artist[] = []
                const completeArtistList  =  allTracks.flatMap((item)=>item.track.artists)
                completeArtistList.map((artist)=>{
                    if(!consolidatedList.some((item)=>item.id===artist.id)){
                        consolidatedList.push(artist)
                    }
                    return artist
                })
                console.log("completeArtistList: ", completeArtistList)
                setArtistsList(consolidatedList)
                // const artistsInTracklist = Array.from(new Set (allTracks.flatMap((item)=>item.track.artists)))
                // setArtistsList(artistsInTracklist)
                setLoadingState(null)

            }).catch((e)=>{
                //TODO: Error Handling
                // setLoadingState("loading")
            })

        } else if (selectedLibraryItem && selectedLibraryItem?.trackDataState) {
            console.log("setcurrent tracks block 5: ", selectedLibraryItem.tracks)

            setTrackDataState(selectedLibraryItem.trackDataState)
            allTracks = selectedLibraryItem.trackDataState.flatMap(track => track.tracks)
            setAllTracks(allTracks)
            let consolidatedList : Artist[] = []

            const completeArtistList  =  allTracks.flatMap((item)=>item.track.artists)
                completeArtistList.map((artist)=>{
                    if(!consolidatedList.some((item)=>item.id===artist.id)){
                        consolidatedList.push(artist)
                    }
                    return artist
                })
                console.log("completeArtistList: ", completeArtistList)
                setArtistsList(consolidatedList)
                // const artistsInTracklist = Array.from(new Set (allTracks.flatMap((item)=>item.track.artists)))
                // setArtistsList(artistsInTracklist)
                setLoadingState(null)

        }else{
            setLoadingState(null)

        }

        nextRef.current  =  selectedLibraryItem?.next
    }, [selectedLibraryItem, setAllTracks, setArtistQuery, setArtistsList, setFilteredTracks, setLoadingState, setSelectedArtistFilters, setTrackDataState])


    let isFeatureFilterSelected = Object.values(selectedFeatures).some(featureVal => typeof featureVal === "number")||popularityFilter

    //** FIlters the selected playlist if the audio featrues have been set*/
    useEffect(() => {
        if (trackDataState != null&&(selectedArtistFilters||popularityFilter) ) {
            setLoadingState("filtering")
            // console.log(featureFilters.at(-1))
            console.log("useEffect run for filtFeatures")
            // console.log("currentTracks: ", currentTracks)
            filterFeatures().then(() => setLoadingState(null))


        } else {
            setFilteredTracks(allTracks)
        }
        



    }, [selectedFeatures, trackDataState, filterFeatures, allTracks, isFeatureFilterSelected, setFilteredTracks, setLoadingState, dateRange, selectedArtistFilters, popularityFilter])



    
// TODO: The below use effect can be used when a production license is assigned to the application. It will enable preview audio in the application
    // useEffect(()=>{
    //     if(allTracks&&!currentAudio){
    //         const audio = new Audio(selectedLibraryItem?.tracks?.at(0).track.preview_url)
    //         const initAudioState: AudioState = {
    //             url:selectedLibraryItem?.tracks?.at(0).track.preview_url,
    //             audio: audio,
    //             audioDetails: {
    //                 trackId: selectedLibraryItem?.tracks?.at(0).track.id,
    //                 artist: selectedLibraryItem?.tracks?.at(0).track.artists[0].name,
    //                 title: selectedLibraryItem?.tracks?.at(0).track.name,
    //                 track: selectedLibraryItem?.tracks.at(0)
    
    //             }
    //         }
    //         setCurrentAudio(initAudioState)
    //     }
    // },[allTracks, currentAudio, selectedLibraryItem, setCurrentAudio])

    const nextRef = useRef(null)

    const scrollContainer = useRef<HTMLDivElement>(null)

    const getNextItems =useCallback( () => {
        setLoadingState("loadingNext")
        selectedLibraryItem?.getNextTracks().then((newTracks) => { setNextTracks(newTracks); setLoadingState(null) }).catch((e)=>{console.error(e)})
    },[selectedLibraryItem, setLoadingState])


      useEffect(()=>{
        const container = scrollContainer.current

        if(selectedLibraryItem?.next   && !loadingState && trackDataState?.length < 4){
            let isThrottled: boolean;

            const handleScroll = () => {
                if(!isThrottled){

            
                const bottom = (scrollContainer.current.clientHeight  + scrollContainer.current.scrollTop) >= scrollContainer.current.scrollHeight -300;
                if (bottom && !loadingState) {
                    isThrottled = true

                  getNextItems();

                  setTimeout(()=>{
                    isThrottled = false
                  }, 1000)
                }
                
            }
              };
        
              container.addEventListener('scroll', handleScroll)
            return ()=>{
                container.removeEventListener('scroll', handleScroll)
            }
        }
    
      },[getNextItems, loadingState, nextTracks, selectedLibraryItem?.next, trackDataState?.length])



    useEffect(() => {
        if (nextTracks) {
            const newTrackData = [{ tracks: nextTracks, audioFeatures: false, categories: false }]
            setTrackDataState(trackDataState.concat(newTrackData))
            // sconst newTracklist = allTracks.concat(nextTracks)
            setAllTracks(allTracks.concat(nextTracks))
            let consolidatedList : Artist[] = [...artistsList]
            const newArtistList  =  nextTracks.flatMap((item)=>item.track.artists)
            newArtistList.map((artist)=>{
                if(!consolidatedList.some((item)=>item.id===artist.id)){
                    consolidatedList.push(artist)
                }
                return artist
            })
            // console.log("completeArtistList: ", completeArtistList)
            setArtistsList(consolidatedList)
            console.log("nextTracks: ", nextTracks)
        }
        setNextTracks(null)
    }, [allTracks, artistsList, nextTracks, setAllTracks, setArtistsList, setTrackDataState, trackDataState])


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

    const [isAllSelected, setIsAllSelected] = useState(false)

    // useEffect(()=>{
    //     const compareSelected = ()=>{
    //         const ids1 = new Set(displayedTracks.map(track=>track.track.id))
    //         const ids2 = new Set(selectedTracks.map(track=>track.track.id))
    //         if (ids1.size !== ids2.size) return false;
    
    //   // Check if every id in ids1 exists in ids2
    //     return [...ids1].every(id => ids2.has(id));
    //     }

    //     const selected = compareSelected()

    //     setIsAllSelected(prev=>prev===selected?selected:prev)
    // },[displayedTracks, selectedTracks])
 




        return (
            <div className="search-filter-container new-playlist" style={stagingState === "open" ? { borderRight: "2px solid #141414", transition: "1s", flex:1, display: 'flex', flexDirection:"column" } : { borderRight: "0px solid #141414", transition: "1s", flex:1, display: 'flex', flexDirection:"column"  }} id="search-filter-div" >
                <div style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#141414",
                    display:"flex",
                    flexDirection:"column",
                    
                }}>
                    <div style={isMobile?{margin:"auto", flex: "1",width: '100%', overflowX: 'auto', whiteSpace: 'nowrap'}:{margin:"auto", flex: "1" }}>
                        <button style={{margin:"auto 10px", flex: "1", borderRadius:'15px'}} onClick={() => { selectAllclicked(); }} value={"SelectAll"}>Select All</button>
                        <button style={{margin:"auto 10px", flex: "1", borderRadius:'15px'}} onClick={() => { deselectAllClicked() }}>Deselect All</button>
                        <button style={{margin:"auto 10px", flex: "1", borderRadius:'15px'}} onClick={() => { stageSelectedDisplayedTracks(); }}>Add Items</button>
                        {/* {isFeatureFilterSelected && loadingState === "filtering" 
                        ?(<p>Filtering Tracks...</p>) 
                        : (<></>)} */}
                    </div>
                    {/* <h3 style={{margin:"5px 15px", textAlign:'center'}}>{selectedLibraryItem?.name}</h3> */}
                    <input disabled={true} placeholder={selectedLibraryItem?selectedLibraryItem?.name:"Select an Item from your library"} type="text" style={{textOverflow: "ellipsis", margin:"4px 15px", fontSize:"1.25em", fontWeight:"bold", border:"none", padding: "0 auto", backgroundColor: "#141414", textAlign:'center', minWidth:"50%", alignSelf:"center", width:"calc(100% - 30px)",}}></input>

                </div>
                
                {loadingState==="loading"
                    ?<div className="search-filter-container new-playlist" id="search-filter-div" >
                        <p>loading...</p>
                    </div>
                    :<div ref={scrollContainer} style={{overflowY: 'auto'}}>
                        
                        <Tracklist setDisplayedTracks={setDisplayedTracks} tracklistArea="selected-playlist" selectedLibraryItems={selectedTracks} setSelectedLibraryItems={setSelectedTracks} draftTracks={addStagedItems}></Tracklist>
                        {selectedLibraryItem?.next ?
                    <div style={{}}>
                        {
                            loadingState === "loadingNext" 
                            ?<button disabled={true} style={{ fontSize:"16px", width: `100%`, overflowX: "hidden", padding: 0 }}>Loading...</button>
                            :<button onClick={() => {
                                    getNextItems() }}
                                    style={{ fontSize:"16px", width: `100%`, overflowX: "hidden", padding: 0 }}>
                                    More
                                </button>
                        }
                    </div> :
                    <></>}
                    </div>}
               
            </div>
        )


}

export default SelectedPlaylistContainer