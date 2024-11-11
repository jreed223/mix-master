import React, { useCallback, useEffect, useRef, useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import PlaylistMenuBar from "./PlaylistMenu";
import SelectedPlaylistContainer from "./SelectedPlaylistArea";
import DraftPlaylistContainer from "./DraftPlaylistArea";
import TrackCollection from "../../models/libraryItems";
import TrackClass from "../../models/Tracks";
import { ActiveView } from "../NavBar";

interface draftingProps{

    selectedLibraryItem: TrackCollection,

    setStagingState: React.Dispatch<React.SetStateAction<string>>,
    stagingState: string,
    setActiveView: React.Dispatch<React.SetStateAction<ActiveView[]>>
    activeView:ActiveView[]
    isSearching:boolean
    setDisabledDashboard: React.Dispatch<React.SetStateAction<boolean>>
    setIsSeraching : React.Dispatch<React.SetStateAction<boolean>>
    setStagedPlaylist: React.Dispatch<React.SetStateAction<TrackClass[]>>
    stagedPlaylist: TrackClass[]


}

export default function DraftingArea(props:draftingProps){
    const [displayFeatureMenu, setDisplayFeatureMenu] = useState(false)
    const [selectedFeatures, setSelecetedFeatures] = useState<Record<string, number>>({})
    // const [stagedPlaylist, setStagedPlaylist] = useState<Track[]>([])
    const [stagedPlaylistState, setStagedPlaylistState] = useState<TrackClass[][]>([[]])
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

    const addStagedItems =(items:TrackClass[])=>{
        const newStagedPlaylist = props.stagedPlaylist.concat(items)
        props.setStagedPlaylist(newStagedPlaylist)
        setStagedPlaylistState(stagedPlaylistState.concat([newStagedPlaylist]))
        console.log("Added items: ",items)
        console.log("new Staged Playlist: ",newStagedPlaylist)
        console.log(stagedPlaylistState)


    }

    const removeStagedItems = (items:TrackClass[])=>{
        const newStagedPlaylist = props.stagedPlaylist.filter(stagedItem=>!items.some(removedItem => removedItem.track.id === stagedItem.track.id))
        props.setStagedPlaylist(newStagedPlaylist)
        setStagedPlaylistState(stagedPlaylistState.concat([newStagedPlaylist]))
        console.log("Removed items: ",items)
        console.log("new Staged Playlist: ",newStagedPlaylist)
        console.log(stagedPlaylistState)

    }
    const getNextTracks = ()=>{
        props.selectedLibraryItem.getNextTracks()
    } 




    const inputControls = [
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature: "danceability", inputType: "range", min: "0", max:"100", default:"50", tooltipText:'Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.'},
        { checkboxRef: useRef(null), sliderRef: useRef(null),  audioFeature: "energy", inputType: "range", min: "0", max:"100", default:"50", tooltipText:'Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.'},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "instrumentalness", inputType: "range", min: "0", max:"100", default:"50", tooltipText:'Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.'},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "acousticness", inputType: "range", min: "0", max:"100", default: "50", tooltipText:'A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.'},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "valence", inputType: "range", min: "0", max:"100", default:"50", tooltipText:'A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).'},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "key", inputType: "range", min: "-1", max:"11", default:"4", tooltipText:'The key the track is in. Integers map to pitches using standard Pitch Class notation. E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on. If no key was detected, the value is -1.'}, //ABS
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "liveness", inputType: "range", min: "0", max:"100", default:"50", tooltipText:'Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.'},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "loudness", inputType: "range", min: "-60", max:"0", default:"-30", tooltipText:'The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db.'}, //ABSRange
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "mode", inputType: "range", min: "0", max:"1", default:"1", tooltipText:'Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by 1 and minor is 0.'}, //ABS
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "speechiness", inputType: "range", min: "0", max:"100", default:"50", tooltipText:'Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.'},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "tempo", inputType: "range", min: "0", max:"200", default:"100", tooltipText: 'The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.'}, //ABSRange
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "time_signature", inputType: "range", min: "3", max:"7", default:"5", tooltipText:'An estimated time signature. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure). The time signature ranges from 3 to 7 indicating time signatures of "3/4", to "7/4".'}, //ABS
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



    return(
        <div ref={creationContainer} className={"playlist-creation-container-hidden"}style={isFullScreen?{width: "100%", overflowX: "clip"}:props.stagingState==="open"?{width:"50%", overflowX: "clip"}:{width:"0%", overflowX: "clip"}} id="creation-container">
        <div style={{width:isFullScreen?"100vw":"50vw", height: "100%", transition: '1s'}}>
        <PlaylistMenuBar setIsFullScreen={setIsFullScreen} isFullScreen={isFullScreen} setIsSeraching={props.setIsSeraching} isSearching={props.isSearching} setDisplayFeatureMenu={setDisplayFeatureMenu} displayFeatureMenu={displayFeatureMenu} setStagingState={props.setStagingState} stagingState={props.stagingState} setDisabledDashboard={props.setDisabledDashboard} disabledDashboard={false} draftingPaneContainer={creationContainer} setActiveView={props.setActiveView}></PlaylistMenuBar>

            <div className="playlist-items-containers" style={{position: "relative"}}>

                <SelectedPlaylistContainer currentAudio={currentAudio} setCurrentAudio={setCurrentAudio} isFullScreen={isFullScreen} stagingState={props.stagingState} isFilterDisplayed={displayFeatureMenu} onSelectedItems={addStagedItems} libraryItem={props.selectedLibraryItem} stagedPlaylistItems={props.stagedPlaylist} onGetNextItems={getNextTracks} featureFilters={selectedFeatures}></SelectedPlaylistContainer>

                {<div style={{display: "flex", overflowX:"hidden", flexDirection:"column", flex:displayFeatureMenu?"1":"0"}} className="new-playlist">
                    {inputControls.map((inputControl, index)=>{

                    return(   
                    <div >  
                        <input ref={inputControl.checkboxRef} onChange={()=>handleInput(index)} type="checkbox" defaultChecked={true}/>
                        <label>{inputControl.audioFeature}</label><div className="tooltip"> ? <span className="tooltip-text">{inputControl.tooltipText}</span></div>
                        <input style={{width: "80%"}} ref={inputControl.sliderRef} id={`${inputControl.audioFeature}-slider`} onChange={()=>handleInput(index)} type={inputControl.inputType} min={inputControl.min} max={inputControl.max} defaultValue={inputControl.default} className="slider" disabled={true}/>
                    </div>
                    )
                })

                    }

                </div>}

                <DraftPlaylistContainer currentAudio={currentAudio} setCurrentAudio={setCurrentAudio} stagingState={props.stagingState} stagedItemsState={stagedPlaylistState} onUndostaging={props.setStagedPlaylist} onSelectedItems={removeStagedItems} stagedTracks={props.stagedPlaylist} removeDraft={removeStagedItems }></DraftPlaylistContainer>
            </div >
            </div>
        </div>
    )
}