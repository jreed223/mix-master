import React, { ReactElement, useCallback, useEffect, useState } from "react"
import { Track } from "../../../../server/types"
import TrackCard, { TrackCardProps } from "./TrackCard"
import TrackClass from "../../../models/Tracks"


interface tracklistProps{
    tracklistArea: string
    // currentUser: UserProfile
    allTracks: TrackClass[]
    selectedLibraryItems: TrackClass[]
    // featureFilters: Record<string, number>
    stagedTracks:TrackClass[]
    setSelectedLibraryItems: React.Dispatch<React.SetStateAction<TrackClass[]>>
    // trackDataState: TrackData[]
    filteredTracks: TrackClass[]
    draftTracks: (selectedItems: TrackClass[]) => void
    currentAudio: {url:string, audio: HTMLAudioElement}
    setCurrentAudio: React.Dispatch<React.SetStateAction<{
    url: string;
    audio: HTMLAudioElement;
}>>

}

export default function Tracklist(props:tracklistProps){

    
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
    if(props.allTracks){
        const hiddenItems = props.allTracks.filter(trackClass=>{
            const staged  = props.stagedTracks.some(item=>item.track.id === trackClass.track.id)

            // const staged  = props.stagedTracks.includes(trackClass)
            const filteredOut = !props.filteredTracks.some(filteredTrack => filteredTrack.track.id === trackClass.track.id)
            // console.log(`staged: ${staged}, filtered: ${filteredOut}`)


            return staged||filteredOut
        })
   
        let hiddenTracksList = []
        let displayedTrackList = []
        props.allTracks.map(trackClass=>{
                        
            if(hiddenItems.some(item=>item.track.id===trackClass.track.id)){
           
                const trackCard =  <TrackCard deselectTrack={deselectTrack}currentAudio={props.currentAudio} setCurrentAudio={props.setCurrentAudio} tracklistArea={props.tracklistArea} key={`selected-playlist-${trackClass.track.id}`} trackClass={trackClass} onSelectedTrack={editSelectedItemList2} displayHidden={true} selectedLibraryItems={props.selectedLibraryItems} draftTrack={props.draftTracks}></TrackCard>
                hiddenTracksList.push(trackCard)
                return TrackCard
               
            }else
      
            {
              
                const trackCard =  <TrackCard deselectTrack={deselectTrack} currentAudio={props.currentAudio} setCurrentAudio={props.setCurrentAudio} tracklistArea={props.tracklistArea} key={`selected-playlist-${trackClass.track.id}`} trackClass={trackClass} onSelectedTrack={editSelectedItemList2} displayHidden={false}  selectedLibraryItems={props.selectedLibraryItems} draftTrack={props.draftTracks} ></TrackCard>
                displayedTrackList.push(trackCard)
                // setDisplayedTracks(displayedTracks.concat([trackCard]))
                return TrackCard
                
            }

        })
        setHiddenTracks(hiddenTracksList)
        setDisplayedTracks(displayedTrackList)



    }
}, [editSelectedItemList2, props.allTracks, props.selectedLibraryItems, props.stagedTracks, props.filteredTracks, props.draftTracks, props.tracklistArea, props, deselectTrack])

if(props.allTracks){
    const hiddenItems = props.allTracks.filter(trackClass=>{ //return all tracks that are hidden
        const staged  = props.stagedTracks.some(item=>item.track.id === trackClass.track.id)

        // const staged2  = props.stagedTracks.includes(trackClass.track)
        const filteredOut = !props.filteredTracks.some(filteredTrack => filteredTrack.track.id === trackClass.track.id)
        // console.log(`staged: ${staged}, filtered: ${filteredOut}`)


        return staged||filteredOut
    })

    let hiddenTracksList = []
    let displayedTrackList = []
    props.allTracks.map(trackClass=>{
                    
        if(hiddenItems.includes(trackClass)){
       
            const trackCard =  <TrackCard deselectTrack={deselectTrack} currentAudio={props.currentAudio} setCurrentAudio={props.setCurrentAudio} tracklistArea={props.tracklistArea} draftTrack={props.draftTracks} key={`selected-playlist-${trackClass.track.id}`} trackClass={trackClass} onSelectedTrack={editSelectedItemList2} displayHidden={true} selectedLibraryItems={props.selectedLibraryItems}></TrackCard>
            hiddenTracksList.push(trackCard)
            return TrackCard
           
        }else
  
        {
          
            const trackCard =  <TrackCard deselectTrack={deselectTrack} currentAudio={props.currentAudio} setCurrentAudio={props.setCurrentAudio} tracklistArea={props.tracklistArea}  draftTrack={props.draftTracks} key={`selected-playlist-${trackClass.track.id}`} trackClass={trackClass} onSelectedTrack={editSelectedItemList2} displayHidden={false}  selectedLibraryItems={props.selectedLibraryItems}></TrackCard>
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