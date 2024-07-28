import React, { ChangeEvent, useRef, useState } from "react"
import { Features } from "../../server/types";
interface PlaylistMenuProps{
    onExit:(stagingState:React.SetStateAction<String>) => void;
    onFilteredItems: (newFilter:Features[]) => void;
}
const PlaylistMenuBar:React.FC<PlaylistMenuProps>=(props: PlaylistMenuProps)=>{

    const[featureDisplayState, setFeatureDisplayState] = useState<boolean>(false)
    const[featureRecords, setFeatureRecords] = useState<Features[]>([
        {
            analysis_url: null,
            acousticness: null,
            danceability: null,
            energy: null,
            instrumentalness: null,
            key: null,
            liveness: null,
            loudness: null,
            mode: null,
            tempo: null,
            time_signature: null,
            valence: null
        }
    ])

    const inputControls = [
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature: "dancability" },
        { checkboxRef: useRef(null), sliderRef: useRef(null),  audioFeature: "energy"},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "tempo"},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "instramentalness"},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "acousticness"},
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature:  "valence"}
      ];
  

const handleInput = (index)=>{
    const { checkboxRef, sliderRef, audioFeature } = inputControls[index];
    sliderRef.current.disabled = checkboxRef.current.checked;
    const currentRecord = featureRecords.at(-1)
    if(checkboxRef.current.checked && currentRecord[audioFeature]){
        sliderRef.current.disabled = true
        delete currentRecord[audioFeature]
        const newRecord = featureRecords.concat(currentRecord)
        props.onFilteredItems(newRecord)
        setFeatureRecords(newRecord)
        console.log(featureRecords)
    }else{
        sliderRef.current.disabled = false
        console.log(currentRecord)
        //const newFeature = {[audioFeature]: parseInt(sliderRef.current.value)}
        currentRecord[audioFeature] = parseInt(sliderRef.current.value)
        const newRecord = featureRecords.concat(currentRecord)
        props.onFilteredItems((newRecord))

    }


}
// const filterFeatures = (feature:) =>{
//     for()
// }



    const toggleDisplayState = ()=>{
        if(featureDisplayState===true){
            setFeatureDisplayState(false)
        }else{
            setFeatureDisplayState(true)
        }
    }
    

    if(featureDisplayState){

        return (
            <div className="playlist-creation-menu-bar" style={{height:100}}>
                <button onClick={()=>props.onExit("closed")}>Close</button>
                <button onClick={()=>{toggleDisplayState()}}>Audio Features</button>
    
                <div style={{display: "flex", flexDirection:"row", flexWrap:"wrap"}}>
                    {inputControls.map((inputControl, index)=>(
                    <div style={{display:"inline"}}>  
                        <label>{inputControl.audioFeature}</label>
                        <input ref={inputControl.checkboxRef} onChange={()=>handleInput(index)} type="checkbox" defaultChecked={true}/>
                        <input ref={inputControl.sliderRef} id={`${inputControl.audioFeature}-slider`} onChange={()=>handleInput(index)} type="range" min="1" max="100" defaultValue="50" className="slider" disabled={true}/>
                    </div>
                    ))

                    }

                </div>
    
            </div>
        )

    }else{
        return(
            <div className="playlist-creation-menu-bar">
                <button onClick={()=>props.onExit("closed")}>Close</button>
                <button onClick={()=>{toggleDisplayState()}}>Audio Features</button>
            </div>
        )
    }

    
}

export default PlaylistMenuBar