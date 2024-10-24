import React, { useCallback, useEffect, useRef, useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import PlaylistMenuBar from "./PlaylistMenu";
import SelectedPlaylistContainer from "./SelectedPlaylistArea";
import DraftPlaylistContainer from "./DraftPlaylistArea";
import TrackCollection from "../../models/libraryItems";
import { Track } from "../../../server/types";

interface draftingProps{

    selectedLibraryItem: TrackCollection,

    setStagingState: React.Dispatch<React.SetStateAction<string>>,
    stagingState: string,
    setActiveView: React.Dispatch<React.SetStateAction<string[]>>
    activeView:string[]
    isSearching:boolean
    setDisabledDashboard: React.Dispatch<React.SetStateAction<boolean>>
    setIsSeraching : React.Dispatch<React.SetStateAction<boolean>>
    setStagedPlaylist: React.Dispatch<React.SetStateAction<Track[]>>
    stagedPlaylist: Track[]


}

export default function DraftingArea(props:draftingProps){
    const [displayFeatureMenu, setDisplayFeatureMenu] = useState(false)
    const [selectedFeatures, setSelecetedFeatures] = useState<Record<string, number>>({})
    // const [stagedPlaylist, setStagedPlaylist] = useState<Track[]>([])
    const [stagedPlaylistState, setStagedPlaylistState] = useState<Track[][]>([[]])
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [currentAudio, setCurrentAudio] = useState<{url:string, audio: HTMLAudioElement}>(null)


    useEffect(()=>{
        if(props.activeView){
            setIsFullScreen(false)
        }
    },[props.activeView])

    useEffect(()=>{
        if(props.isSearching){
            setIsFullScreen(false)
        }
    },[props.isSearching])

    const creationContainer = useRef(null)

    const addStagedItems =(items:Track[])=>{
        const newStagedPlaylist = props.stagedPlaylist.concat(items)
        props.setStagedPlaylist(newStagedPlaylist)
        setStagedPlaylistState(stagedPlaylistState.concat([newStagedPlaylist]))
        console.log("Added items: ",items)
        console.log("new Staged Playlist: ",newStagedPlaylist)
        console.log(stagedPlaylistState)


    }

    const removeStagedItems = (items:Track[])=>{
        const newStagedPlaylist = props.stagedPlaylist.filter(stagedItem=>!items.some(removedItem => removedItem.id === stagedItem.id))
        props.setStagedPlaylist(newStagedPlaylist)
        setStagedPlaylistState(stagedPlaylistState.concat([newStagedPlaylist]))
        console.log("Removed items: ",items)
        console.log("new Staged Playlist: ",newStagedPlaylist)
        console.log(stagedPlaylistState)

    }
    const getNextTracks = ()=>{
        props.selectedLibraryItem.getNextTracks()
    } 


    const closeCreationContainer = useCallback(()=>{
        props.setStagingState("closed")
        setIsFullScreen(false)

        if(!props.isSearching){
            props.setDisabledDashboard(false)
            props.setActiveView(["dashboard"])
        }
        // console.log(stagingState)
        creationContainer.current.classList = "playlist-creation-container-hidden shrink-staging"
        // libraryContainer.current.classList = "library-container grow-library"

    }, [props])

    const inputControls = [
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature: "danceability", inputType: "range", min: "0", max:"100", default:"50"},
        { checkboxRef: useRef(null), sliderRef: useRef(null),  audioFeature: "energy", inputType: "range", min: "0", max:"100", default:"50"},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "instrumentalness", inputType: "range", min: "0", max:"100", default:"50"},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "acousticness", inputType: "range", min: "0", max:"100", default: "50"},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "valence", inputType: "range", min: "0", max:"100", default:"50"},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "key", inputType: "range", min: "-1", max:"11", default:"4"}, //ABS
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "liveness", inputType: "range", min: "0", max:"100", default:"50"},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "loudness", inputType: "range", min: "-60", max:"0", default:"-30"}, //ABSRange
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "mode", inputType: "range", min: "0", max:"1", default:"1"}, //ABS
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "speechiness", inputType: "range", min: "0", max:"100", default:"50"},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "tempo", inputType: "range", min: "0", max:"200", default:"100"}, //ABSRange
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "time_signature", inputType: "range", min: "3", max:"7", default:"5"}, //ABS
      ];

      const clearSelections =()=>{

        for(let input of inputControls){
            input.checkboxRef.current.checked = true
            input.sliderRef.current.disabled = true
        }
        setSelecetedFeatures({})
        // props.onFilterSet({})
    
    
    }
    
    
      const handleInput = (index)=>{
        const { checkboxRef, sliderRef, audioFeature } = inputControls[index];
        sliderRef.current.disabled = checkboxRef.current.checked;
        const currentSelection = {...selectedFeatures}
    
        if(checkboxRef.current.checked && selectedFeatures[audioFeature]){
            sliderRef.current.disabled = true
            delete currentSelection[audioFeature]
    
            setSelecetedFeatures(currentSelection)
            // props.onFilterSet(currentSelection)
    
            console.log(selectedFeatures)
    
        }else{
            sliderRef.current.disabled = false
      
            currentSelection[audioFeature] = parseInt(sliderRef.current.value)
    
            setSelecetedFeatures(currentSelection)
            console.log(selectedFeatures)
            // props.onFilterSet(currentSelection)
    
        }
    
    
    }
    const toggleDisplayState = ()=>{
        if(displayFeatureMenu===true){
            setDisplayFeatureMenu(false)
        }else{
            setDisplayFeatureMenu(true)
        }
    }

    const toggleFullScreen = ()=>{
        if(!isFullScreen&&props.isSearching){
            props.setIsSeraching(false)
        }
        setIsFullScreen(!isFullScreen)

    }


    return(
        <div ref={creationContainer} className={"playlist-creation-container-hidden"}style={isFullScreen?{width: "100%"}:props.stagingState==="open"?{width:"50%"}:{width:"0%"}} id="creation-container">
        <PlaylistMenuBar toggleFullScreen={toggleFullScreen} onExit={closeCreationContainer}  togglefeatures={toggleDisplayState}></PlaylistMenuBar>

            <div className="playlist-items-containers" style={{position: "relative"}}>
           
                
                <SelectedPlaylistContainer currentAudio={currentAudio} setCurrentAudio={setCurrentAudio} isFullScreen={isFullScreen} stagingState={props.stagingState} isFilterDisplayed={displayFeatureMenu} onSelectedItems={addStagedItems} libraryItem={props.selectedLibraryItem} stagedPlaylistItems={props.stagedPlaylist} onGetNextItems={getNextTracks} featureFilters={selectedFeatures}></SelectedPlaylistContainer>


                {<div style={{display: "flex", overflowX:"hidden", flexDirection:"column", flex:displayFeatureMenu?"1":"0"}} className="new-playlist">
                    {inputControls.map((inputControl, index)=>(
                    <div >  
                        <input ref={inputControl.checkboxRef} onChange={()=>handleInput(index)} type="checkbox" defaultChecked={true}/>
                        <label>{inputControl.audioFeature}</label>
                        <input style={{width: "80%"}} ref={inputControl.sliderRef} id={`${inputControl.audioFeature}-slider`} onChange={()=>handleInput(index)} type={inputControl.inputType} min={inputControl.min} max={inputControl.max} defaultValue={inputControl.default} className="slider" disabled={true}/>
                    </div>
                    ))

                    }

                </div>}

                <DraftPlaylistContainer currentAudio={currentAudio} setCurrentAudio={setCurrentAudio} stagingState={props.stagingState} stagedItemsState={stagedPlaylistState} onUndostaging={props.setStagedPlaylist} onSelectedItems={removeStagedItems} stagedTracks={props.stagedPlaylist} removeDraft={removeStagedItems }></DraftPlaylistContainer>
            </div >
        </div>
    )
}