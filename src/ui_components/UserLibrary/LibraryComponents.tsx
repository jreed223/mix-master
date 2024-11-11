import { CircularProgress } from "@mui/material";
import React, { Suspense } from "react"
import { useEffect, useState } from "react"
import { LibraryItemsView } from "./LibraryCollectionsWindow";
import { ActiveView } from "../NavBar";
import TrackCollection from "../../models/libraryItems";

interface LibraryComponentsProps {

  setActiveView: React.Dispatch<React.SetStateAction<ActiveView[]>>
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>
  isSearching: boolean
  stagingState: String
  activeView: ActiveView[]
  userId: string
  selectedLibraryItemId: string
  setStagingState: React.Dispatch<React.SetStateAction<string>>
  onPlaylistSelection: (selection: TrackCollection, currentView: ActiveView) => void
}

export const LibraryComponents: React.FC<LibraryComponentsProps> = (props: LibraryComponentsProps) => {

  const fetchAllPlaylists = () => {
    console.log("FETCHING PLAYLISTS")
    const playlistList = fetch("/spotify-data/playlists")
      .then(res => res.json()).then((playlists) => {
        console.log("PLAYLISTS: ", playlists)
        return playlists
      })
    return playlistList

  }

  const fetchLikedAlbums = () => {
    console.log("FETCHING PLAYLISTS")

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


  const fetchedPlaylistsResource = suspensify(fetchAllPlaylists())
  const fetchedAlbumsResource = suspensify(fetchLikedAlbums())


  const [primaryViewStyle, setPrimaryViewStyle] = useState<{ width: string, transition: string }>(null)
  const [secondaryViewStyle, setSecondaryViewStyle] = useState<{ width: string, transition: string }>(null)


  useEffect(() => {

    console.log("ACTIVE VIEW RAN!!!")



    switch (props.activeView.at(-1)) {
      case "Dashboard":
        setSecondaryViewStyle({
          width: "50%",
          transition: "1s"
        })
        setPrimaryViewStyle({
          width: "50%",
          transition: "1s"
        })
        break;
      case "User Playlists":
        if (!props.isSearching) {
          setSecondaryViewStyle({
            width: "0%",

            transition: "1s"
          })
        }

        setPrimaryViewStyle({
          width: "100%",
          transition: "1s"
        })

        break;
      case "Liked Playlists":


        setSecondaryViewStyle({
          width: "100%",

          transition: "1s"
        })
        setPrimaryViewStyle({
          width: "0%",

          transition: "1s"
        })
        break;
      case "Liked Albums":


        setSecondaryViewStyle({
          width: "100%",

          transition: "1s"
        })
        setPrimaryViewStyle({
          width: "0%",

          transition: "1s"
        })
        break;

    }


  }, [props.isSearching, props.activeView])




  return (
    <div style={{ flexGrow: 1 }} className="library-container" id="library-container">

      <div className="user-library-items" style={primaryViewStyle}>
        <Suspense fallback={<CircularProgress />}>
          <LibraryItemsView setStagingState={props.setStagingState}  fetchedLibraryResource={fetchedPlaylistsResource} setActiveView={props.setActiveView} setIsSearching={props.setIsSearching} isSearching={props.isSearching} stagingState={props.stagingState} activeView={props.activeView} userId={props.userId} onPlaylistSelection={props.onPlaylistSelection} selectedLibraryItemId={props.selectedLibraryItemId} viewName={"User Playlists"} primaryView={"User Playlists"}></LibraryItemsView>
        </Suspense>
      </div>
      <div className="liked-library-items" style={secondaryViewStyle}>
        <Suspense fallback={<CircularProgress />}>
          <LibraryItemsView setStagingState={props.setStagingState}  fetchedLibraryResource={fetchedPlaylistsResource} setActiveView={props.setActiveView} setIsSearching={props.setIsSearching} isSearching={props.isSearching} stagingState={props.stagingState} activeView={props.activeView} userId={props.userId} onPlaylistSelection={props.onPlaylistSelection} selectedLibraryItemId={props.selectedLibraryItemId} viewName={"Liked Playlists"} primaryView={"User Playlists"}  ></LibraryItemsView>
        </Suspense>
        <Suspense fallback={<CircularProgress />}>
          <LibraryItemsView setStagingState={props.setStagingState}  fetchedLibraryResource={fetchedAlbumsResource} setActiveView={props.setActiveView} setIsSearching={props.setIsSearching} isSearching={props.isSearching} stagingState={props.stagingState} activeView={props.activeView} userId={props.userId} onPlaylistSelection={props.onPlaylistSelection} selectedLibraryItemId={props.selectedLibraryItemId} viewName={"Liked Albums"} primaryView={"User Playlists"}></LibraryItemsView>
        </Suspense>
      </div>

    </div>
  )



}