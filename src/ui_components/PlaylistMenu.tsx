import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { Features, PlaylistItem } from "../../server/types";
import PlaylistClass from "../models/playlistClass";
interface PlaylistMenuProps{
    onExit:() => void;
    onFilterSet: (newFilter:React.SetStateAction<Record<string, number>>) => void;
    // selectedPlaylist: PlaylistClass;

    // currentTracks: PlaylistItem[]|null

}
const PlaylistMenuBar:React.FC<PlaylistMenuProps>=(props: PlaylistMenuProps)=>{
    const[featureDisplayState, setFeatureDisplayState] = useState<boolean>(false)


    const [selectedFeatures, setSelecetedFeatures] = useState<Record<string, number>>({})

    const inputControls = [
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature: "danceability" },
        { checkboxRef: useRef(null), sliderRef: useRef(null),  audioFeature: "energy"},
        // { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "tempo"},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "instrumentalness"},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "acousticness"},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "valence"}
      ];
  

const handleInput = (index)=>{
    const { checkboxRef, sliderRef, audioFeature } = inputControls[index];
    sliderRef.current.disabled = checkboxRef.current.checked;
    const currentSelection = {...selectedFeatures}

    if(checkboxRef.current.checked && selectedFeatures[audioFeature]){
        sliderRef.current.disabled = true
        delete currentSelection[audioFeature]

        setSelecetedFeatures(currentSelection)
        props.onFilterSet(currentSelection)

        console.log(selectedFeatures)

    }else{
        sliderRef.current.disabled = false
  
        currentSelection[audioFeature] = parseInt(sliderRef.current.value)

        setSelecetedFeatures(currentSelection)
        console.log(selectedFeatures)
        props.onFilterSet(currentSelection)

    }


}

const clearSelections =()=>{

    for(let input of inputControls){
        input.checkboxRef.current.checked = true
        input.sliderRef.current.disabled = true
    }
    setSelecetedFeatures({})
    props.onFilterSet({})


}





    const toggleDisplayState = ()=>{
        if(featureDisplayState===true){
            setFeatureDisplayState(false)
        }else{
            setFeatureDisplayState(true)
        }
    }
    

    // if(featureDisplayState){

        return (
            <div className="playlist-creation-menu-bar" style={featureDisplayState?{height:100}:{}}>
                <button onClick={()=>props.onExit()}>Close</button>
                <button  onClick={()=>{toggleDisplayState()}}>Audio Features</button>
                <button onClick={()=>clearSelections()}>Clear Feature Selections</button>
    
                <div style={{display: "flex", flexDirection:"row", flexWrap:"wrap"}}>
                    {inputControls.map((inputControl, index)=>(
                    <div style={featureDisplayState?{display:"inline"}:{display:"none"}}>  
                        <label>{inputControl.audioFeature}</label>
                        <input ref={inputControl.checkboxRef} onChange={()=>handleInput(index)} type="checkbox" defaultChecked={true}/>
                        <input ref={inputControl.sliderRef} id={`${inputControl.audioFeature}-slider`} onChange={()=>handleInput(index)} type="range" min="1" max="100" defaultValue="50" className="slider" disabled={true}/>
                    </div>
                    ))

                    }

                </div>
    
            </div>
        )


    
}

export default PlaylistMenuBar