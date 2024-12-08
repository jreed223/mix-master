import { CircularProgress } from "@mui/material";
import React, { Suspense, useContext, useMemo } from "react"
import { useEffect, useState } from "react"
import { LibraryItemsView } from "./LibraryCollectionsWindow";
import { NavigationContext, NavigationContextType } from "../../state_management/NavigationProvider";
import { submissionStatusState } from "../DraftingPaneComponents/Playlists/DraftPlaylistArea";

interface LibraryComponentsProps {
  userId: string
  dialogText:submissionStatusState
  setDialogText: React.Dispatch<React.SetStateAction<submissionStatusState>>
//   fetchedPlaylistsResource: {
//     read(): any;
// }
// fetchedAlbumsResource: {
//   read(): any;
// }
reloadKey: number
}

export const LibraryComponents: React.FC<LibraryComponentsProps> = (props: LibraryComponentsProps) => {
  

  const {activeView, isSearching, primaryView} = useContext<NavigationContextType>(NavigationContext)

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
  const fetchedAlbumsResource = useMemo(()=>suspensify(fetchLikedAlbums()),[])


  const [primaryViewStyle, setPrimaryViewStyle] = useState<{ width: string, transition: string }>(null)
  const [secondaryViewStyle, setSecondaryViewStyle] = useState<{ width: string, transition: string, marginTop: string, height: string}>(null)
  const [displayDialog, setDisplayDialog] = useState<boolean>(false)



  useEffect(() => {

    switch (activeView.at(-1)) {
      case "Dashboard":
        setSecondaryViewStyle({
          width: "50%",
          transition: "1s",
          marginTop: "30px",
          height: "calc(100vh - 80px)"
        })
        setPrimaryViewStyle({
          width: "50%",
          transition: "1s"
        })
        break;
      case primaryView:
        if (!isSearching) {
          setSecondaryViewStyle(prev=>{return{
            width: "0%",

            transition: "1s",
                      marginTop: prev.marginTop,
          height: prev.height
          }})
        }

        setPrimaryViewStyle({
          width: "100%",
          transition: "1s"
        })

        break;
      default:


        setSecondaryViewStyle({
          width: "100%",

          transition: "1s",
          marginTop: "0px",
          height: "calc(100vh - 50px)"
        })
        setPrimaryViewStyle({
          width: "0%",

          transition: "1s"
        })
        break;

    }


  }, [isSearching, activeView, primaryView])

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



  return (
    <div style={{ flexGrow: 1 }} className="library-container" id="library-container">
      <dialog style={{width: "25vh", margin: "15px auto", backgroundColor: "#141414", color:"#757575", opacity:displayDialog?1:0, transition:'1s', position: 'absolute', zIndex:99, left:"calc(50% - 14.5px)"}} open={props.dialogText?true:false}>{props.dialogText?`${props.dialogText.status}: ${props.dialogText.text}`:""}</dialog>

      <div className="user-library-items" style={primaryViewStyle}>
        <Suspense fallback={<CircularProgress />}>
          <LibraryItemsView  reloadKey={props.reloadKey} fetchedLibraryResource={fetchedPlaylistsResource} userId={props.userId} viewName={primaryView}  ></LibraryItemsView>
        </Suspense>
      </div>
      <div className="liked-library-items" style={secondaryViewStyle}>
        <Suspense fallback={<CircularProgress />}>
          <LibraryItemsView   fetchedLibraryResource={fetchedPlaylistsResource} userId={props.userId} viewName={"Liked Playlists"} ></LibraryItemsView>
        </Suspense>
        <Suspense fallback={<CircularProgress />}>
          <LibraryItemsView  fetchedLibraryResource={fetchedAlbumsResource} userId={props.userId} viewName={"Liked Albums"}  ></LibraryItemsView>
        </Suspense>
      </div>

    </div>
  )



}