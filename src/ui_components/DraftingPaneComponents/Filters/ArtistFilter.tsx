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
import type { Artist } from "../../../../server/types.js";




export default function ArtistFilter(){


    const {isPlaylistsView, isMobile, isMaxDraftView, setIsMaxDraftView} = useContext(ViewContext)
    const {stagingState} = useContext<DraftingContextType>(DraftingContext)
    const {artistsList, artistQuery, setSelectedArtistFilters, selectedArtistFilters, setArtistQuery} = useContext<TracklistContextType>(TracklistContext)

    const [filterDisabled, setFilterDisabled] = useState<boolean>(false)
    const [currentList, setCurrentList] = useState<Artist[]>(null)
        const artistSearch = useRef(null)
    

      useEffect(()=>{
            if(artistsList?.length>0 && artistQuery){
                const filteredArtists = artistsList.filter((artist)=>artist.name.toLowerCase().startsWith(artistQuery.toLowerCase()))
                setCurrentList(filteredArtists)

            }else if(artistsList){
              setCurrentList(artistsList)

              
            }
        },[artistQuery, artistsList, selectedArtistFilters, setSelectedArtistFilters])

    const clearFilter =()=>{
        for(let artist of selectedArtistFilters){
            const name = artist.name+'-checkbox'
            const artistCheckbox :HTMLInputElement = document.querySelector(`input[name="${name}"]`)

            if(artistCheckbox){
                artistCheckbox.checked = false
            }
        }
        setSelectedArtistFilters([])
        setArtistQuery("")
    }



    const artistFilter = (
    <>
                        <div style={{height: "30px", alignContent: "center"}}>
                            {/* <input key={"artist-checkbox"} ref={null} onChange={() => handlePopularityFilter()} type="checkbox" defaultChecked={true} /> */}
                            <input key={"artist-search"} ref={artistSearch} style={{ width: "80%", margin: 'auto' }} id={`artist-searchr`} onChange={(e) => setArtistQuery(e.target.value)} value={artistQuery} type={"search"} placeholder={"Search Artists"} className="slider" disabled={false} />
                        </div>
                        {  <>{artistsList&&artistsList.length>0?<div style={{ maxHeight: "33vh", overflowY: 'auto'}}>
                        {artistsList.map((artist:Artist)=>{
                            if(currentList?.some((item:Artist)=>item.id===artist.id)){

                            
                           return (<div>
                                        <input key={`${artist.name}-checkbox`} name={`${artist.name}-checkbox`} id={`${artist.name}-checkbox`} onChange={(e) => e.target.checked?setSelectedArtistFilters(prev=>prev.concat([artist])):setSelectedArtistFilters(selectedArtistFilters?.length>0?selectedArtistFilters.filter(filterArtist=>filterArtist.name!==artist.name):[])} type="checkbox" defaultChecked={false} />
                                                <label htmlFor={`${artist.name}-checkbox`} style={{}}>{artist.name}</label>
                            </div>)
                            }else{
                                return (<div style={{display:"none"}}>
                                    <input key={`${artist.name}-checkbox`} name={`${artist.name}-checkbox`} id={`${artist.name}-checkbox`} onChange={(e) => e.target.checked?setSelectedArtistFilters(prev=>prev.concat([artist])):setSelectedArtistFilters(selectedArtistFilters?.length>0?selectedArtistFilters.filter(filterArtist=>filterArtist.name!==artist.name):[])} type="checkbox" defaultChecked={false} />
                                            <label htmlFor={`${artist.name}-checkbox`} style={{}}>{artist.name}</label>
                        </div>)
                            }
                        })}
                    </div>:<></>
                        }
                    </>}

    </>    
    )



    return(
       <>
        <FilterItem filterName="Artists" clearFilter={clearFilter} setFilterState={setSelectedArtistFilters} children={artistFilter} filterDisabled={filterDisabled} setFilterDisabled={setFilterDisabled}></FilterItem>
       </>
    )
}