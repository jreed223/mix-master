import { CircularProgress } from "@mui/material";
import React, { Suspense, useCallback, useContext, useMemo, useRef } from "react"
import { useEffect, useState } from "react"
import { submissionStatusState } from "../DraftingPaneComponents/Playlists/DraftPlaylistArea.tsx";
import { ViewContext, ViewContextType } from "../../state_management/ViewProvider.tsx";
// import { LibraryItemsView } from "./UserLibrary/LibraryCollectionsWindow";
import SearchAndPlaylists from "./SearchAndContent.tsx";
import { PlaylistsView } from "./UserLibrary/PlaylistsView.tsx";
import TrackCollection from "../../models/TrackCollection.ts";
import { LikedTracks, SearchResults } from "../../../server/types.js";
import { parse, stringify } from "flatted";

interface LibraryComponentsProps {
  userId: string
  dialogText:submissionStatusState
  setDialogText: React.Dispatch<React.SetStateAction<submissionStatusState>>
reloadKey: number
}

export const LibrarySelectionPane: React.FC<LibraryComponentsProps> = (props: LibraryComponentsProps) => {
    const [libraryItems, setLibraryItems] = useState<TrackCollection[]>(null)
    const [usersSavedTracks, setUsersSavedTracks] = useState<TrackCollection>(null)
    const {user} = useContext(ViewContext)
   
    const initNextLink = useRef<string|null>(null);

   
 

      useEffect(()=>{
            const fetchAllPlaylists = async () => {

    
      const playlistList = await fetch("/spotify-data/playlists")
        .then(async res => await res.json()).then((playlists: SearchResults['playlists']) => {
          return playlists
        })

        sessionStorage.setItem("initLibraryItems", JSON.stringify(playlistList))

  
      const fetchedPlaylists = playlistList.items.filter(playlist=>playlist&&playlist?.id).map(playlist=>new TrackCollection(playlist))
      setLibraryItems(fetchedPlaylists)
      initNextLink.current = playlistList.next
      // setNextPlaylistsLink(playlistList.next)
      // return playlistList
    }

        if (!libraryItems) {
      
          const cachedLibrary = sessionStorage.getItem("initLibraryItems")
      
          if(cachedLibrary){
            const playlistData = JSON.parse(cachedLibrary)
            const cachedPlaylists = playlistData.items.filter(playlist=>playlist&&playlist?.id).map(playlist=>new TrackCollection(playlist))


            // const cachedCollections:TrackCollection[] = items.map(item=>new TrackCollection(item, true))
            console.log("cached library found", cachedPlaylists)
      
            
            setLibraryItems(cachedPlaylists)
          }else{
            fetchAllPlaylists()
          }
      
        }
      
      
      },[libraryItems])
      
      useEffect(()=>{

           const fetchSavedTracks = async () => {
        const res = await fetch("/spotify-data/liked-tracks", {
          method: "GET"
        })
        if (res.ok) {
          const tracks: LikedTracks = await res.json()
          tracks.type = "liked tracks"
          console.log("NEW COLLECTION!!! ", tracks)
          sessionStorage.setItem("initSavedTracks", JSON.stringify(tracks))

    
          const newCollection = new TrackCollection(tracks)
          newCollection.owner = user
          console.log("NEW COLLECTION!!! ", newCollection)
          setUsersSavedTracks(newCollection)
        } else {
    
        }
      }

        if(!usersSavedTracks){


          
          const cachedLikedTracks = sessionStorage.getItem("initSavedTracks")
          if(cachedLikedTracks){
            const newCollection = new TrackCollection(JSON.parse(cachedLikedTracks))
            newCollection.owner = user
            console.log("NEW COLLECTION!!! ", newCollection)
            setUsersSavedTracks(newCollection)
          }else{
            fetchSavedTracks()
          }
        }
      },[user, usersSavedTracks])

    // useEffect(()=>{
    //   if(libraryItems){
    //     sessionStorage.setItem("libraryItems", JSON.stringify(libraryItems))
    //   }


    // },[libraryItems])

// useEffect(()=>{
//   if(usersSavedTracks){
//     sessionStorage.setItem("savedTracks", stringify(usersSavedTracks))
//   }
// },[usersSavedTracks])


  // const fetchAllPlaylists = (reloadKey) => {
  //   const playlistList = fetch("/spotify-data/playlists")
  //     .then(res => res.json()).then((playlists) => {
  //       return playlists
  //     })
  //   return playlistList
  // }

  const fetchLikedAlbums = () => {
    const res = fetch("/spotify-data/albums")
      .then(res => res.json())
      .then(albums => {
        return albums
      })
    return res

  }






  const [displayDialog, setDisplayDialog] = useState<boolean>(false)



  useEffect(()=>{
    if(props.dialogText){
      setDisplayDialog(true)
    }
  },[props.dialogText])

  useEffect(()=>{
    if(displayDialog){
      const hideDialog = setTimeout(()=>{
        setDisplayDialog(false)
        setTimeout(()=>{
          props.setDialogText(null)
        }, 1000)
      },3000)

      return () => clearTimeout(hideDialog)

    }
  }, [displayDialog, props])

  const playlists = (    

      <PlaylistsView libraryItems={libraryItems} setLibraryItems={setLibraryItems} savedTracks={usersSavedTracks} nextLink={initNextLink.current} userId={props.userId} viewName={"All Playlists"}  ></PlaylistsView>
  )



  return (
    <div style={{ flexGrow: 1, overflowY: "hidden" }} className="library-container" id="library-container">
      <dialog style={{width: "25vh", margin: "15px auto", backgroundColor: "#141414", color:"#757575", opacity:displayDialog?1:0, transition:'1s', position: 'absolute', zIndex:99, left:"calc(50% - 14.5px)"}} open={props.dialogText?true:false}>{props.dialogText?`${props.dialogText.status}: ${props.dialogText.text}`:""}</dialog>
      <SearchAndPlaylists children={playlists}></SearchAndPlaylists>
    </div>
  )



}