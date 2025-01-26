import React, { useContext, useEffect, useRef, useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import DraftingMenuBar from "../DraftingMenu.tsx";
import SelectedPlaylistContainer from "../Playlists/SelectedPlaylistArea.tsx";
import DraftPlaylistContainer from "../Playlists/DraftPlaylistArea.tsx";
import { ViewContext } from "../../../state_management/ViewProvider.tsx";
import { DraftingContext, DraftingContextType } from "../../../state_management/DraftingPaneProvider.tsx";
import FilterMenu from "./FilterMenu.tsx";
import TracklistProvider, { TracklistContext, TracklistContextType } from "../../../state_management/TracklistProvider.tsx";
import Calendar from "react-calendar";
import FilterItem from "./FilterItem.tsx";
import { FilterContext } from "../../../state_management/FilterProvider.tsx";

export interface PopularityFilterProps {
    filterDisabled: boolean
    setFilterDisabled: React.Dispatch<React.SetStateAction<boolean>>
}


export default function PopularityFilter(props: PopularityFilterProps){


    const {isPlaylistsView, isMobile, isMaxDraftView, setIsMaxDraftView} = useContext(ViewContext)
    const {stagingState} = useContext<DraftingContextType>(DraftingContext)
    const { setPopularityFilter} = useContext(FilterContext)

    // const [filterDisabled, setFilterDisabled] = useState<boolean>(true)
        const popularitySlider = useRef(null)

        useEffect(()=>{
            if(props.filterDisabled){
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
        <FilterItem  filterName="Popularity" setFilterState={setPopularityFilter} children={slider} filterDisabled={props.filterDisabled} setFilterDisabled={props.setFilterDisabled}></FilterItem>
       </>
    )
}