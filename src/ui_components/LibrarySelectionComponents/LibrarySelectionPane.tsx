import { CircularProgress } from "@mui/material";
import React, { Suspense, useContext, useMemo } from "react"
import { useEffect, useState } from "react"
import { submissionStatusState } from "../DraftingPaneComponents/Playlists/DraftPlaylistArea";
import { NavigationContext, NavigationContextType } from "../../state_management/NavigationProvider";
// import { LibraryItemsView } from "./UserLibrary/LibraryCollectionsWindow";
import SearchAndPlaylists from "./SearchPane/SearchAndContent";
import { PlaylistsView } from "./UserLibrary/PlaylistsView";

interface LibraryComponentsProps {
  userId: string
  dialogText:submissionStatusState
  setDialogText: React.Dispatch<React.SetStateAction<submissionStatusState>>
reloadKey: number
}

export const LibrarySelectionPane: React.FC<LibraryComponentsProps> = (props: LibraryComponentsProps) => {
  


  const fetchAllPlaylists = (reloadKey) => {
    const playlistList = fetch("/spotify-data/playlists")
      .then(res => res.json()).then((playlists) => {
        return playlists
      })
    return playlistList
  }

  const fetchLikedAlbums = () => {
    const res = fetch("/spotify-data/albums")
      .then(res => res.json())
      .then(albums => {
        return albums
      })
    return res

  }




  function suspensify(promise: Promise<any>) {
    let status = "pending";
    let result: any;
    let suspender = promise.then(
      (res) => {
        status = "success";
        result = res;
      },
      (err) => {
        status = "error";
        result = err;
      }
    );

    return {
      read() {
        if (status === "pending") {
          throw suspender;  // Suspense will catch this and display fallback
        } else if (status === "error") {
          throw result; // ErrorBoundary will catch this
        } else if (status === "success") {
          return result;  // Data is ready, return it
        }
      },
    };
  }


  const fetchedPlaylistsResource = useMemo(()=>suspensify(fetchAllPlaylists(props.reloadKey)),[props.reloadKey])
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

    <Suspense fallback={<CircularProgress />}>
      <PlaylistsView  fetchedLibraryResource={fetchedPlaylistsResource} userId={props.userId} viewName={"All Playlists"}  ></PlaylistsView>
    </Suspense>
  )



  return (
    <div style={{ flexGrow: 1, overflowY: "hidden" }} className="library-container" id="library-container">
      <dialog style={{width: "25vh", margin: "15px auto", backgroundColor: "#141414", color:"#757575", opacity:displayDialog?1:0, transition:'1s', position: 'absolute', zIndex:99, left:"calc(50% - 14.5px)"}} open={props.dialogText?true:false}>{props.dialogText?`${props.dialogText.status}: ${props.dialogText.text}`:""}</dialog>
      <SearchAndPlaylists children={playlists}></SearchAndPlaylists>
    </div>
  )



}