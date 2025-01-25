import React, { useContext, useEffect, useRef, useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import DraftingMenuBar from "../DraftingMenu.tsx";
import SelectedPlaylistContainer from "../Playlists/SelectedPlaylistArea.tsx";
import DraftPlaylistContainer from "../Playlists/DraftPlaylistArea.tsx";
import { ViewContext } from "../../../state_management/ViewProvider.tsx";
import { DraftingContext, DraftingContextType } from "../../../state_management/DraftingPaneProvider.tsx";
import FilterMenu from "./FilterMenu.tsx";
import TracklistProvider from "../../../state_management/TracklistProvider.tsx";
import Calendar from "react-calendar";
import { minHeight } from '@mui/system';


interface FilterProps  {
    filterName:string
    setFilterState: React.Dispatch<React.SetStateAction<any>>
    filterDisabled?: boolean
    setFilterDisabled?: React.Dispatch<React.SetStateAction<boolean>>
    // resetFilter:'disable'|'clear'
    children?: React.JSX.Element
    clearFilter?: ()=>void

}

export default function FilterItem(props: FilterProps){


    // const {isPlaylistsView, isMobile, isMaxDraftView, setIsMaxDraftView} = useContext(ViewContext)
    // const {stagingState} = useContext<DraftingContextType>(DraftingContext)

    const [isDisplayed, setIsDisplayed] = useState(false)

    const toggleFilter = props.clearFilter?()=> props.clearFilter():() => {
        if (!props.filterDisabled) {
            props.setFilterState(null)
        }
        props.setFilterDisabled(prev => !prev)
        // console.log(calendarDisabled)
        // console.log(dateRange)


    }
    // useEffect(()=>{
    //     if(stagingState==="closed"){
    //         setIsMaxDraftView(false)
    //     }
    // },[stagingState, setIsMaxDraftView])




    return(
        <div key={`${props.filterName}-div`} style={{justifyItems: "center", padding: "10px",borderRadius: "25px", transition: "height 1s", display:'flex', flexFlow:'column', flex: '0 1 auto', flexBasis:isDisplayed?"auto": "65px", overflow: "hidden", whiteSpace:'nowrap', backgroundColor:"#141414", margin: "7px"  }}>
        <div style={{display: "flex",  alignItems: "baseline", flexFlow:"wrap", justifyContent:'center'}}>
            <p style={{display: "inline-block", margin: 0, minWidth: "40%"}}>{props.filterName}</p>
            {/* <div className="tooltip"> ? <span className="tooltip-text">{'tooltip Text!!'}</span></div> */}
            <div style={{flex: 1, display: "flex", justifyContent:"space-between"}}>
                <button key={`${props.filterName}-checkbox`} style={{flex: "0 0 auto", borderRadius: "15px"}} ref={null} onClick={(e) => { toggleFilter() }} >{props.clearFilter?"Clear":props.filterDisabled?"Enable":"Disable"}</button>
                <button style={{display:'inline', flex: "0 0 auto", borderRadius: "15px"}} onClick={()=>setIsDisplayed(prev=>!prev)}>{isDisplayed?"\u2227":'\u2228'}</button>
            </div>
        </div>

        <div style={{ margin:isDisplayed?"7px 0px":"0px 0px", flex:isDisplayed?"1 1 auto":"0 1 auto", flexBasis:isDisplayed?"100%":"0", maxHeight:isDisplayed?"50vh":"0vh", transition:'.5s',overflow:'hidden'}}>
            {props.children}
            {/* <input key={"popularity-slider"} ref={popularitySlider} style={{width: "80%", margin:'auto'}} id={`popularity-slider`} onChange={()=>handlePopularityFilter()} type={"range"} min={0} max={100} defaultValue={50} className="slider" disabled={true}/> */}
        </div>
    </div>
    )
}