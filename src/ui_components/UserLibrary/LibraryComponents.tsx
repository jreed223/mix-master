import { CircularProgress } from "@mui/material";
import React, { Suspense, useContext, useMemo } from "react"
import { useEffect, useState } from "react"
import { LibraryItemsView } from "./LibraryCollectionsWindow";
import { NavigationContext, NavigationContextType } from "../../state_management/NavigationProvider";

interface LibraryComponentsProps {
  userId: string
}

export const LibraryComponents: React.FC<LibraryComponentsProps> = (props: LibraryComponentsProps) => {

  const {activeView, isSearching, primaryView} = useContext<NavigationContextType>(NavigationContext)

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


  const fetchedPlaylistsResource = useMemo(()=>suspensify(fetchAllPlaylists()),[])
  const fetchedAlbumsResource = useMemo(()=>suspensify(fetchLikedAlbums()),[])


  const [primaryViewStyle, setPrimaryViewStyle] = useState<{ width: string, transition: string }>(null)
  const [secondaryViewStyle, setSecondaryViewStyle] = useState<{ width: string, transition: string }>(null)


  useEffect(() => {

    console.log("ACTIVE VIEW RAN!!!")
    switch (activeView.at(-1)) {
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
      case primaryView:
        if (!isSearching) {
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
      default:


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


  }, [isSearching, activeView, primaryView])




  return (
    <div style={{ flexGrow: 1 }} className="library-container" id="library-container">
      <div className="user-library-items" style={primaryViewStyle}>
        <Suspense fallback={<CircularProgress />}>
          <LibraryItemsView  fetchedLibraryResource={fetchedPlaylistsResource} userId={props.userId}  viewName={primaryView} ></LibraryItemsView>
        </Suspense>
      </div>
      <div className="liked-library-items" style={secondaryViewStyle}>
        <Suspense fallback={<CircularProgress />}>
          <LibraryItemsView   fetchedLibraryResource={fetchedPlaylistsResource}  userId={props.userId} viewName={"Liked Playlists"}></LibraryItemsView>
        </Suspense>
        <Suspense fallback={<CircularProgress />}>
          <LibraryItemsView  fetchedLibraryResource={fetchedAlbumsResource} userId={props.userId}  viewName={"Liked Albums"} ></LibraryItemsView>
        </Suspense>
      </div>

    </div>
  )



}