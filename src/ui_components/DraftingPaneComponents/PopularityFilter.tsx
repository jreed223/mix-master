import React, { useContext, useEffect, useRef, useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import PlaylistMenuBar from "./PlaylistMenu";
import SelectedPlaylistContainer from "./Playlists/SelectedPlaylistArea";
import DraftPlaylistContainer from "./Playlists/DraftPlaylistArea";
import { ViewContext } from "../../state_management/ViewProvider";
import { DraftingContext, DraftingContextType } from "../../state_management/DraftingPaneProvider";
import FilterMenu from "./FilterMenu";
import TracklistProvider, { TracklistContext, TracklistContextType } from "../../state_management/TracklistProvider";
import Calendar from "react-calendar";
import FilterItem from "./FilterItem";




export default function PopularityFilter(){


    const {isPlaylistsView, isMobile, isMaxDraftView, setIsMaxDraftView} = useContext(ViewContext)
    const {stagingState} = useContext<DraftingContextType>(DraftingContext)
    const { setPopularityFilter} = useContext<TracklistContextType>(TracklistContext)

    const [filterDisabled, setFilterDisabled] = useState<boolean>(true)
        const popularitySlider = useRef(null)

        useEffect(()=>{
            if(filterDisabled){
                popularitySlider.current.disabled = true
                setPopularityFilter(null)


            }else{
                popularitySlider.current.disabled = false

            }
        })
    const handlePopularityFilter = () => {


            popularitySlider.current.disabled = false

            const selectedPopularity = parseInt(popularitySlider.current.value)

            setPopularityFilter(selectedPopularity)


    }



    const slider = (
        <input key={"popularity-slider"} ref={popularitySlider} style={{ width: "80%", margin: 'auto' }} id={`popularity-slider`} onChange={() => handlePopularityFilter()} type={"range"} min={0} max={100} defaultValue={50} className="slider" disabled={true} />
    )



    return(
       <>
        <FilterItem filterName="Popularity" setFilterState={setPopularityFilter} children={slider} filterDisabled={filterDisabled} setFilterDisabled={setFilterDisabled}></FilterItem>
       </>
    )
}