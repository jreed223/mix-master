import React, { ReactElement, useCallback, useEffect, useState, useContext } from "react"
import TrackCard, { TrackCardProps } from "./TrackCard"
import TrackClass from "../../../models/Tracks"
import { DraftingContext } from "../../../state_management/DraftingPaneProvider"
import { TracklistContext } from "../../../state_management/TracklistProvider"


interface tracklistProps{
    tracklistArea: string
    // allTracks: TrackClass[]
    selectedLibraryItems: TrackClass[]

    setSelectedLibraryItems: React.Dispatch<React.SetStateAction<TrackClass[]>>
    // filteredTracks: TrackClass[]
    draftTracks: (selectedItems: TrackClass[]) => void


}

export default function Tracklist(props:tracklistProps){

    const {
        
        stagedPlaylist
        
                } = useContext(DraftingContext)    
        const {allTracks, filteredTracks} = useContext(TracklistContext)

const [displayedTracks, setDisplayedTracks] = useState<ReactElement<TrackCardProps>[]>([])

const [hiddenTracks, setHiddenTracks] = useState<ReactElement<TrackCardProps>[]>([])

const editSelectedItemList2 = useCallback((checked: boolean ,selectedItem: TrackClass)=>{
    if(checked){
        // const lst = selectedLibraryItems.concat([selectedItem])
        console.log("track card checked: ", console.log(props.selectedLibraryItems))

        props.setSelectedLibraryItems(props.selectedLibraryItems.concat([selectedItem]))

    }else{

        console.log("track card unchecked: ", console.log(props.selectedLibraryItems.filter(item=>item!== selectedItem)))
        props.setSelectedLibraryItems(props.selectedLibraryItems.filter(item=>item!== selectedItem))
    }
    // console.log(selectedPlaylistItems)
}, [props])
const deselectTrack = useCallback((trackId)=>{
    props.setSelectedLibraryItems(props.selectedLibraryItems.filter(item=>item.track.id!==trackId))
},[props])

///*Sets hidden tracks*//
useEffect(()=>{
    if(allTracks){
        const hiddenItems = allTracks.filter(trackClass=>{
            const staged  = stagedPlaylist?.some(item=>item.track.id === trackClass.track.id)

            // const staged  = stagedPlaylist.includes(trackClass)
            const filteredOut = !filteredTracks?.some(filteredTrack => filteredTrack.track.id === trackClass.track.id)
            // console.log(`staged: ${staged}, filtered: ${filteredOut}`)


            return staged||filteredOut
        })
   
        let hiddenTracksList = []
        let displayedTrackList = []
        allTracks.map(trackClass=>{
                        
            if(hiddenItems.some(item=>item.track.id===trackClass.track.id)){
           
                const trackCard =  <TrackCard deselectTrack={deselectTrack} tracklistArea={props.tracklistArea} key={`selected-playlist-${trackClass.track.id}`} trackClass={trackClass} onSelectedTrack={editSelectedItemList2} displayHidden={true} selectedLibraryItems={props.selectedLibraryItems} draftTrack={props.draftTracks}></TrackCard>
                hiddenTracksList.push(trackCard)
                return TrackCard
               
            }else
      
            {
              
                const trackCard =  <TrackCard deselectTrack={deselectTrack} tracklistArea={props.tracklistArea} key={`selected-playlist-${trackClass.track.id}`} trackClass={trackClass} onSelectedTrack={editSelectedItemList2} displayHidden={false}  selectedLibraryItems={props.selectedLibraryItems} draftTrack={props.draftTracks} ></TrackCard>
                displayedTrackList.push(trackCard)
                // setDisplayedTracks(displayedTracks.concat([trackCard]))
                return TrackCard
                
            }

        })
        setHiddenTracks(hiddenTracksList)
        setDisplayedTracks(displayedTrackList)



    }
}, [editSelectedItemList2, allTracks, props.selectedLibraryItems, stagedPlaylist, filteredTracks, props.draftTracks, props.tracklistArea, props, deselectTrack])

if(allTracks){
    const hiddenItems = allTracks.filter(trackClass=>{ //return all tracks that are hidden
        const staged  = stagedPlaylist.some(item=>item.track.id === trackClass.track.id)

        // const staged2  = stagedPlaylist.includes(trackClass.track)
        const filteredOut = !filteredTracks.some(filteredTrack => filteredTrack.track.id === trackClass.track.id)
        // console.log(`staged: ${staged}, filtered: ${filteredOut}`)


        return staged||filteredOut
    })
    console.log("ALL TRACKS!!! ", allTracks)

    let hiddenTracksList = []
    let displayedTrackList = []
    allTracks.map(trackClass=>{
                    
        if(hiddenItems.includes(trackClass)){
       
            const trackCard =  <TrackCard deselectTrack={deselectTrack}  tracklistArea={props.tracklistArea} draftTrack={props.draftTracks} key={`selected-playlist-${trackClass.track.id}`} trackClass={trackClass} onSelectedTrack={editSelectedItemList2} displayHidden={true} selectedLibraryItems={props.selectedLibraryItems}></TrackCard>
            hiddenTracksList.push(trackCard)
            return TrackCard
           
        }else
  
        {
          
            const trackCard =  <TrackCard deselectTrack={deselectTrack} tracklistArea={props.tracklistArea}  draftTrack={props.draftTracks} key={`selected-playlist-${trackClass.track.id}`} trackClass={trackClass} onSelectedTrack={editSelectedItemList2} displayHidden={false}  selectedLibraryItems={props.selectedLibraryItems}></TrackCard>
            displayedTrackList.push(trackCard)
            // setDisplayedTracks(displayedTracks.concat([trackCard]))
            return TrackCard
            
        }})
    
    
    return(
        <>
               {
                    displayedTracks
                }
                {
                    hiddenTracks
                }
     
        </>
    )

}
}