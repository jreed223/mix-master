import React, { useEffect, useState } from "react"
import { Features, PlaylistItem } from "../../server/types"
import TrackCard from "./TrackCard"
import PlaylistClass from "../models/playlistClass"
interface SelectedPlaylistContainerProps{
    playlist: PlaylistClass|null
    stagedPlaylistItems: PlaylistItem[]|null
    onSelectedItems: (selectedItems: PlaylistItem[]) => void
    audioFeatureFilters: Features[]

}

const SelectedPlaylistContainer:React.FC<SelectedPlaylistContainerProps>=(props: SelectedPlaylistContainerProps)=>{

// const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistClass|null>(null)
// const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]|null>(null)
const [selectedPlaylistItems, setSelectedPlaylistItems] = useState<PlaylistItem[]>([])
const [filteredTracks, setFilteredTracks] =useState<PlaylistItem[]>([])
const [hasAudioFeatures, setHasAudioFeatures] = useState<boolean>(false)
//const [featureFilters, setFeatureFilters] = useState<Features[]>([])
// {
//     analysis_url: null,
//     acousticness: null,
//     danceability: null,
//     energy: null,
//     instrumentalness:null,
//     key: null,
//     liveness: null,
//     loudness: null,
//     mode: null,
//     tempo: null,
//     time_signature: null,
//     valence:null,
// }

const editSelectedItemList = (e: React.ChangeEvent<HTMLInputElement>,selectedItem: PlaylistItem)=>{
    if(e.target.checked){
        setSelectedPlaylistItems(selectedPlaylistItems.concat([selectedItem]))

    }else{
        setSelectedPlaylistItems(selectedPlaylistItems.filter(item=>item!== selectedItem))
    }
    console.log(selectedPlaylistItems)
}



useEffect(()=>{
    setHasAudioFeatures(false)
    setFilteredTracks([])
    console.log("filtered tracks reset: ", filteredTracks)
    if(props.playlist?.tracks){
        if(!props.playlist.audioFeaturesSet){
            props.playlist.setAudioFeatures().then(()=>{
                console.log("audio features set")
                setHasAudioFeatures(true)
            })
            
        }else{
            console.log("audio features set in else")

            setHasAudioFeatures(true)
        }


        // let featureCount = 0
        
        if(hasAudioFeatures && props.playlist.audioFeaturesSet && props.audioFeatureFilters.length > 0){
            const unStagedItems = props.playlist.tracks.filter(unStagedItem=>!props.stagedPlaylistItems.some(stagedItem => stagedItem.track.id === unStagedItem.track.id))
            let filterPlaylist = unStagedItems

            const newFilters = props.audioFeatureFilters.at(-1)
            const featureFilters = Object.keys(newFilters)
            for(let feature of featureFilters){
                if(typeof newFilters[feature] === "number"){
                    // featureCount+=1
                    // console.log(featureCount)
                    console.log("feature: ",feature)
                    const featureVal = newFilters[feature]/100
                    console.log("feature-val: ",featureVal)

                filterPlaylist = filterPlaylist.filter(item=> item.track.audio_features[feature]>=featureVal-.1&&item.track.audio_features[feature]>=featureVal+.1)
                console.log("filtered playlist set: ", filterPlaylist)
                }
                
            }
            setFilteredTracks(filterPlaylist)
            // console.log("filteredTracks: ",filteredTracks)

        }

}



}, [hasAudioFeatures, props.audioFeatureFilters, props.playlist, props.stagedPlaylistItems])

const stageSelectedDisplayedTracks = () =>{
    if(filteredTracks.length>0){
    const selectedDisplayed = (selectedPlaylistItems.filter(selectedItem=>filteredTracks.some(filteredItem=>selectedItem.track.id === filteredItem.track.id)))
    console.log("selected displayed tracks: ", selectedDisplayed)
    props.onSelectedItems(selectedDisplayed);
    const selectedHidden = (selectedPlaylistItems.filter(selectedItem=>!filteredTracks.some(filteredItem=>selectedItem.track.id === filteredItem.track.id)))
    console.log("selected hidden tracks: ", selectedHidden)
    setSelectedPlaylistItems(selectedHidden)
    }else{
    props.onSelectedItems(selectedPlaylistItems);
    setSelectedPlaylistItems([])
    }
    
}



const fetaureValues = props.audioFeatureFilters.length>0?Object.values(props.audioFeatureFilters.at(-1)):[]
const hasSetFilters = fetaureValues.some(featureval=>typeof featureval==="number")

console.log("tracks:", props.playlist?.tracks )
    if(props.playlist?.tracks.length>0){
        console.log(props.audioFeatureFilters)
        const unStagedItems = props.playlist.tracks.filter(unStagedItem=>!props.stagedPlaylistItems.some(stagedItem => stagedItem.track.id === unStagedItem.track.id))
        console.log("display block 2")
        return(
            <div className="search-filter-container new-playlist" id="search-filter-div" >
                <button onClick={()=>{stageSelectedDisplayedTracks();}}>Add Items</button>
                {hasSetFilters?
                    hasAudioFeatures?
                        props.playlist.tracks.map(singleTrack=>{
                            const staged = !unStagedItems.includes(singleTrack)
                            const hiddenTracks = !filteredTracks.some(filteredTrack => filteredTrack.track.id === singleTrack.track.id)
                            if(staged){
                                console.log("stagedItem rendered")
                                return(
                                    <TrackCard playlistItem={singleTrack} onSelectedTrack={editSelectedItemList} displayHidden={hiddenTracks} checked={false}></TrackCard>
                                    )
                            }else{
                                console.log("unstaged Item rendered")
                                console.log(`single track: ${JSON.stringify(singleTrack)} in filtered Track? ${filteredTracks.includes(singleTrack)}`)
                                return(
                                    <TrackCard playlistItem={singleTrack} onSelectedTrack={editSelectedItemList} displayHidden={hiddenTracks} checked={null}></TrackCard>
                                    )
                            }
                            
                    }):
                        (
                        <p>Loading...</p>
                        ):
                    props.playlist.tracks.map(singleTrack=>{
                        const staged = !unStagedItems.includes(singleTrack)
                            if(staged){
                                console.log("staged no audio feature item")
                                return(
                                    <TrackCard playlistItem={singleTrack} onSelectedTrack={editSelectedItemList} displayHidden={unStagedItems.includes(singleTrack)?false:true} checked={false}></TrackCard>
                                    )
                            }else{
                                console.log("unstaged no audio feature item")

                                return(
                                    
                                    <TrackCard playlistItem={singleTrack} onSelectedTrack={editSelectedItemList} displayHidden={unStagedItems.includes(singleTrack)?false:true} checked={null}></TrackCard>
                                    )
                            }


                        }
                            )
                }
                
            </div>
        )
    }else {
        console.log("display block 3")
        return(
        <div className="search-filter-container new-playlist" id="search-filter-div" >
            <p>Loading...</p>
        </div>
        )
    }
}

export default SelectedPlaylistContainer