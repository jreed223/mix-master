import React, { useContext, useEffect, useRef, useState } from "react"
// import { UserProfile } from '@spotify/web-api-ts-sdk';
import PlaylistMenuBar from "./PlaylistMenu.tsx";
import SelectedPlaylistContainer from "./Playlists/SelectedPlaylistArea.tsx";
import DraftPlaylistContainer from "./Playlists/DraftPlaylistArea.tsx";
import { ViewContext } from "../../state_management/ViewProvider.tsx";
import { DraftingContext, DraftingContextType } from "../../state_management/DraftingPaneProvider.tsx";
import FilterMenu from "./FilterMenu.tsx";
import TracklistProvider, { TracklistContext, TracklistContextType } from "../../state_management/TracklistProvider.tsx";
import Calendar from "react-calendar";
import FilterItem from "./FilterItem.tsx";




export default function CalendarFilter(){


    const {isPlaylistsView, isMobile, isMaxDraftView, setIsMaxDraftView} = useContext(ViewContext)
    const {stagingState} = useContext<DraftingContextType>(DraftingContext)
    const {setDateRange, dateRange} = useContext<TracklistContextType>(TracklistContext)

    const [filterDisabled, setFilterDisabled] = useState<boolean>(false)


    const handleDateSelection = (dates: Date | [Date, Date]) => {
        if (Array.isArray(dates)) {
            console.log("DATES: ", `\n Date 1: ${dates[0]} \n Date 2: ${dates[1]}`)
            // const dateList: [] = dates
            if(dates.at(1)===null){
                setDateRange(null)
            }else{
                setDateRange(dates);

            }
        }
    };

    const disableFutureDates = (date: Date) => {
        return date > new Date();  // Disable any date in the future
    };

    const clearSelection = ()=>{
        setDateRange(null)
    }


    const calendar = (<Calendar onChange={(date) => handleDateSelection(date)} value={dateRange} allowPartialRange maxDetail="year" selectRange={true}  tileDisabled={ filterDisabled?()=>true:({ date }) => disableFutureDates(date)}/>
    )



    return(
       <>
        <FilterItem filterName="Date Range" clearFilter={clearSelection} setFilterState={setDateRange} children={calendar} filterDisabled={filterDisabled} setFilterDisabled={setFilterDisabled}></FilterItem>
       </>
    )
}