import React, { ReactElement, useCallback, useEffect, useState } from "react"
import { Track } from "../../../../server/types"
import TrackCard, { TrackCardProps } from "./TrackCard"


interface tracklistProps{
    tracklistArea: string
    // currentUser: UserProfile
    allTracks: Track[]
    selectedLibraryItems: Track[]
    // featureFilters: Record<string, number>
    stagedTracks:Track[]
    setSelectedLibraryItems: React.Dispatch<React.SetStateAction<Track[]>>
    // trackDataState: TrackData[]
    filteredTracks: Track[]
    draftTracks: (selectedItems: Track[]) => void
    currentAudio: {url:string, audio: HTMLAudioElement}
    setCurrentAudio: React.Dispatch<React.SetStateAction<{
    url: string;
    audio: HTMLAudioElement;
}>>

}

export default function Tracklist(props:tracklistProps){

    
const [displayedTracks, setDisplayedTracks] = useState<ReactElement<TrackCardProps>[]>([])

const [hiddenTracks, setHiddenTracks] = useState<ReactElement<TrackCardProps>[]>([])

const editSelectedItemList2 = useCallback((checked: boolean ,selectedItem: Track)=>{
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
    props.setSelectedLibraryItems(props.selectedLibraryItems.filter(item=>item.id!==trackId))
},[props])

///*Sets hidden tracks*//
useEffect(()=>{
    if(props.allTracks){
        const hiddenItems = props.allTracks.filter(track=>{
            const staged  = props.stagedTracks.includes(track)
            const filteredOut = !props.filteredTracks.some(filteredTrack => filteredTrack.id === track.id)
            // console.log(`staged: ${staged}, filtered: ${filteredOut}`)


            return staged||filteredOut
        })
   
        let hiddenTracksList = []
        let displayedTrackList = []
        props.allTracks.map(singleTrack=>{
                        
            if(hiddenItems.includes(singleTrack)){
           
                const trackCard =  <TrackCard deselectTrack={deselectTrack}currentAudio={props.currentAudio} setCurrentAudio={props.setCurrentAudio} tracklistArea={props.tracklistArea} key={`selected-playlist-${singleTrack.id}`} track={singleTrack} onSelectedTrack={editSelectedItemList2} displayHidden={true} selectedLibraryItems={props.selectedLibraryItems} draftTrack={props.draftTracks}></TrackCard>
                hiddenTracksList.push(trackCard)
                return TrackCard
               
            }else
      
            {
              
                const trackCard =  <TrackCard deselectTrack={deselectTrack} currentAudio={props.currentAudio} setCurrentAudio={props.setCurrentAudio} tracklistArea={props.tracklistArea} key={`selected-playlist-${singleTrack.id}`} track={singleTrack} onSelectedTrack={editSelectedItemList2} displayHidden={false}  selectedLibraryItems={props.selectedLibraryItems} draftTrack={props.draftTracks} ></TrackCard>
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
    const hiddenItems = props.allTracks.filter(track=>{ //return all tracks that are hidden
        const staged  = props.stagedTracks.includes(track)
        const filteredOut = !props.filteredTracks.some(filteredTrack => filteredTrack.id === track.id)
        // console.log(`staged: ${staged}, filtered: ${filteredOut}`)


        return staged||filteredOut
    })

    let hiddenTracksList = []
    let displayedTrackList = []
    props.allTracks.map(singleTrack=>{
                    
        if(hiddenItems.includes(singleTrack)){
       
            const trackCard =  <TrackCard deselectTrack={deselectTrack} currentAudio={props.currentAudio} setCurrentAudio={props.setCurrentAudio} tracklistArea={props.tracklistArea} draftTrack={props.draftTracks} key={`selected-playlist-${singleTrack.id}`} track={singleTrack} onSelectedTrack={editSelectedItemList2} displayHidden={true} selectedLibraryItems={props.selectedLibraryItems}></TrackCard>
            hiddenTracksList.push(trackCard)
            return TrackCard
           
        }else
  
        {
          
            const trackCard =  <TrackCard deselectTrack={deselectTrack} currentAudio={props.currentAudio} setCurrentAudio={props.setCurrentAudio} tracklistArea={props.tracklistArea}  draftTrack={props.draftTracks} key={`selected-playlist-${singleTrack.id}`} track={singleTrack} onSelectedTrack={editSelectedItemList2} displayHidden={false}  selectedLibraryItems={props.selectedLibraryItems}></TrackCard>
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