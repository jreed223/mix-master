import React, { useContext, useEffect, useState } from "react"
import { ViewContext } from "../../state_management/ViewProvider.tsx"
import { DraftingContext } from "../../state_management/DraftingPaneProvider.tsx"
import TrackClass from "../../models/Tracks.ts"
import TrackCollection from "../../models/TrackCollection.ts"
import { Playlist } from "../../../server/types.js"
// import { Features, PlaylistItem } from "../../../server/types";
// import PlaylistClass from "../../models/playlistClass";
interface PlaylistMenuProps {
    setSelectedPlaylistTracks: React.Dispatch<React.SetStateAction<TrackClass[]>>
    setSelectedDraftTracks: React.Dispatch<React.SetStateAction<TrackClass[]>>
    setDialogText: React.Dispatch<React.SetStateAction<submissionStatusState>>

    draftingPaneContainer: React.MutableRefObject<any>



}
export type submissionStatusState = {status:"Pending"|"Success"|"Failed", text: string}

const PlaylistMenuBar: React.FC<PlaylistMenuProps> = (props: PlaylistMenuProps) => {
    const {  isMobile, isMaxDraftView, setIsMaxDraftView, user } = useContext(ViewContext)
    const { displayFeatureMenu, setStagingState, setDisplayFeatureMenu, setDisplaySubmsnProgress, setSubmissionState, playlistName, stagedPlaylist, setDisplayWarning, setStagedPlaylistState,  setStagedPlaylist, stagedPlaylistState} = useContext(DraftingContext)
    const [displaySubmsnProgress, setDisplaySubmsnProgress1] = useState(false)
    const [submissionState, setSubmissionState1] = useState<submissionStatusState>(null)
    const [playlistName1, setPlaylistName] = useState<string>(null)
    

    const closeCreationContainer = () => {
        setStagingState("closed")
        setIsMaxDraftView(false)

  
        // console.log(stagingState)
        props.draftingPaneContainer.current.classList = "playlist-creation-container-hidden shrink-staging"
        // libraryContainer.current.classList = "library-container grow-library"

    }

    const toggleFullScreen = () => {
        setIsMaxDraftView(prev => !prev)
    }

    const toggleFeatures = () => {
        setDisplayFeatureMenu(prev => !prev)
    }

    const clearSelections = () => {
        props.setSelectedDraftTracks([])
        props.setSelectedPlaylistTracks([])
    }


      const submitDraftPlaylist = async () : Promise<boolean>=>{
            setDisplaySubmsnProgress(true)
            // fetch("spotify-data/create-playlist")
            const createPlaylist = async (): Promise<TrackCollection>  => {
                // console.log(artistProps.item.id)
    
                    const newPlaylist: Playlist = await fetch("/spotify-data/create-playlist", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ playlistName:playlistName, id:user.id })
                        // headers: {"id" : `${this.id}` }
                    }).then(async (res) => {
                        if(res.ok){console.log(res)
                            const playlist = await res.json()
                            return playlist
                        }else{
                            return null
                        }
                        
                    }).catch(e=>{
                        console.log(e)
                    })
                    console.log(newPlaylist)
                    
                    const newCollection = new TrackCollection(newPlaylist)
                    
                    // setUserLibraryItems([newCollection].concat(userLibraryItems))
                    return newCollection
                    // const newPlaylistCard =  <LibraryItemCard key={newCollection.id}  libraryItem={newCollection} ownerId={user.id} view={"User Playlists"} ></LibraryItemCard>
    
            }
    
            const addItems = async (playlistId: string) : Promise<boolean>=>{
                const uriList = stagedPlaylist.reverse().map(track=>track.track?.uri)
    
                const itemSubmission = await fetch("/spotify-data/add-tracks", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ uriList:uriList, id: playlistId })
                    // headers: {"id" : `${this.id}` }
                }).then(async (res) => {
                    if(res.ok){
                        return true
                        // const playlist = await res.json()
                        // return playlist
                    }else{
                        return false
                    }
                    
                }).catch(e=>{
                    console.log(e)
                    return false
                })
    
                return itemSubmission
    
            }
    
            if(!playlistName||playlistName.length===0){
                setDisplayWarning(true)
            }else{
                const pending : submissionStatusState = {status: "Pending", text: "Your playlist is being created."}
                setSubmissionState(pending)
                setDisplaySubmsnProgress(true)
    
            const newPlaylist = await createPlaylist()
            // setNewplaylistId(newPlaylist.id)
    
            if(!newPlaylist){
                // setSubmissionState(prev=>prev.concat(["fail"]))
                const failed: submissionStatusState = {status: "Failed", text: "Failed to create a new playlist."}
                setSubmissionState(failed)
                props.setDialogText(failed)
                console.log('Failed to create playlist')
                return false
            }else{
                // setSubmissionState(prev=>prev.concat(["submitted"]))
                const isPlaylistSubmitted = await addItems(newPlaylist.id)
                if(isPlaylistSubmitted){
                    // setSubmissionState(prev=>prev?prev.concat(["success"]):["success"])
                    const success:submissionStatusState = {status: "Success", text: "Your playlist has been created!"}
                    setSubmissionState(success)
                    props.setDialogText(success)
    
                    console.log("Items have been added")
       
                    
                    // setUserLibraryItems(null)
                    // props.setReloadKey(prev=>prev+1)
                }else{
                    // setSubmissionState(prev=>prev?prev.concat(["fail"]):["fail"])
                    const failed: submissionStatusState = {status: "Failed", text: "Your playlist has been created. Failed to add all items."}
                    setSubmissionState(failed)
                    props.setDialogText(failed)
    
    
                    console.log("Failed to submit items")
                }
                return isPlaylistSubmitted
    
            }
    
            }
        }

        const clearDraft = ()=>{
            setStagedPlaylist([]);
            setStagedPlaylistState([]); 
            setPlaylistName("");
        }

    useEffect(()=>{
        if(isMobile){
            setIsMaxDraftView(false)
        }
    },[isMobile, setIsMaxDraftView])



    return (
        <div className="playlist-creation-menu-bar" >
            <button className='draft-pane-button' onClick={() => closeCreationContainer()}>Close</button>
            <button className='draft-pane-button' onClick={() => { toggleFeatures() }}>Filter</button>
            {/* {isMobile?<button className='draft-pane-button' onClick={() => { clearSelections() }}>Clear Selections</button>:<></>} */}
            <button disabled={stagedPlaylist.length===0&&stagedPlaylistState.length===0}className='draft-pane-button' onClick={() => { clearDraft() }}>Clear Draft</button>
            <button disabled={(stagedPlaylist.length===0 || submissionState)?true:false}className='draft-pane-button' onClick={stagedPlaylist.length>0 && !submissionState?()=> submitDraftPlaylist():()=>{} }>Submit Draft</button>

            {!isMobile?<button disabled={isMobile} className='draft-pane-button' style={{ transition:'1s'}} onClick={() => toggleFullScreen()}>Full Screen</button>:<></>}

        </div>
    )



}

export default PlaylistMenuBar