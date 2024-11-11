import React, { useEffect, useState, useRef } from "react"
import { Album, Playlist } from "../../../server/types";
import TrackCollection from "../../models/libraryItems";
import LibraryItemCard from "./LibraryItemCard";
import { ActiveView } from "../NavBar";



interface LibraryItemsViewProps {
  selectedLibraryItemId: string | null,
  userId: string,
  onPlaylistSelection: (selection: TrackCollection, currentView: ActiveView) => void
  activeView: ActiveView[]
  stagingState: String
  isSearching: boolean
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView[]>>
  viewName: ActiveView
  primaryView: ActiveView
  fetchedLibraryResource: {
    read(): any;
  }
  setStagingState: React.Dispatch<React.SetStateAction<string>>
}





export const LibraryItemsView: React.FC<LibraryItemsViewProps> = (props: LibraryItemsViewProps) => {
  const [libraryItems, setLibraryItems] = useState(null)
  const [currentCards, setCurrentCards] = useState<[]>(null)
  const [libraryItemCards, setLibraryItemCards] = useState(null)
  const [heightThreshold, setHeightThreshold] = useState(null)
  const [widthThreshold, setWidthThreshold] = useState(null)


  const libraryItemsContainer = useRef(null)

  let libraryCollections;
  if (!libraryItems) {
    switch (props.viewName) {
      case 'Liked Albums':
        const albums: Album[] = props.fetchedLibraryResource.read()
        libraryCollections = albums.map((album: Album | Playlist) => {
          return new TrackCollection(album['album'])
        })
        break;
      case 'Liked Playlists':
        const playlists1: Playlist[] = props.fetchedLibraryResource.read()
        const likedPlaylists = playlists1.filter((playlistObject: Playlist) =>
          playlistObject.owner.id !== props.userId
        )

        libraryCollections = likedPlaylists.map((playlistObject: Playlist) => new TrackCollection(playlistObject))
        break;
      case 'User Playlists':
        const playlists2: Playlist[] = props.fetchedLibraryResource.read()
        const userPlaylists = playlists2.filter((playlistObject: Playlist) =>
          playlistObject.owner.id === props.userId
        )

        libraryCollections = userPlaylists.map((playlistObject: Playlist) => new TrackCollection(playlistObject))
        break;
    }

    setLibraryItems(libraryCollections)
  }

  useEffect(() => {
    if (libraryItems) {
      const cards = libraryItems?.map(item =>
        <LibraryItemCard setIsSearching={props.setIsSearching} key={item.id} onSelectedCollection={props.onPlaylistSelection} libraryItem={item} ownerId={""} selectedLibraryItemId={props.selectedLibraryItemId} currentView={props.viewName} ></LibraryItemCard>)
      setLibraryItemCards(cards)
    }
  }, [props.setIsSearching, props.onPlaylistSelection, props.selectedLibraryItemId, libraryItems, props.viewName])


  const [outterContainerStyle, setOutterContainerStyle] = useState({
    width: props.stagingState === "open" || props.isSearching ? "calc(25vw - 37.5px)" : "calc(50vw - 37.5px)",
    height: "50%",
    transition: "1s",
  })

  const [innerContentStyle, setInnerContentStyle] = useState({
    height: "80%",
    transition: "1s",
    overflowY: 'auto' as 'auto' | 'clip',
    position: 'relative' as 'relative',
    margin: '0px 25px',
    background: "#141414"
  })

  const [primaryContentStyle, setPrimaryContentStyle] = useState(null)




  useEffect(() => {
    if (props.viewName !== props.primaryView) {
      switch (props.activeView.at(-1)) {
        case "Dashboard":

          const dashboardHeight =
            props.stagingState === "open"
              ? {
                width: "25vw",
                height: "50%",
                transition: "1s"
              }
              : {
                width: "50vw",
                height: "50%",
                transition: "1s"
              }

          setOutterContainerStyle(dashboardHeight)
          break;
        case props.viewName:

          const activeHeight =
            (props.stagingState === "open" || props.isSearching)
              ? {
                width: "50vw",
                height: "100%",
                transition: "1s"
              }
              : {
                width: "100vw",
                height: "100%",
                transition: "1s"
              }

          setOutterContainerStyle(activeHeight)
          break;
        case props.primaryView:

          break;

        default:
          const hiddenHeight = (props.stagingState === "open" || props.isSearching)
            ? {
              width: "50vw",
              height: "0%",
              transition: "1s"
            }
            : {
              width: "100vw",
              height: "0%",
              transition: "1s"

            }

          setOutterContainerStyle(hiddenHeight)
          break;



      }
    } else {

      const growFromDefault = {
        width: props.stagingState === "open" || props.isSearching ? "50vw" : "100vw",
        transition: "1s",
        overflowY: "auto"

      }
      const shrinkToDefault = {
        width: props.stagingState === "open" || props.isSearching ? "25vw" : "50vw",
        transition: "1s",
        overflowY: "auto"
      }
      console.log(props.activeView.at(-1) !== "User Playlists")
      if (props.activeView.at(-1) === "Dashboard") {
        setPrimaryContentStyle(shrinkToDefault)
      } else if (props.activeView.at(-1) === "User Playlists") {
        setPrimaryContentStyle(growFromDefault)

      }

    }
  }, [props.stagingState, props.activeView, props.isSearching, libraryItemCards, props.viewName, props.primaryView])

  const [currentFlexFlow, setCurrentFlexFlow] = useState('row')
  useEffect(() => {

    if (props.viewName !== props.primaryView) {
      const calcThreshold = () => {
        setHeightThreshold((50 / 100) * window.innerHeight - 24.5)

        setWidthThreshold((window.innerWidth))
      }

      calcThreshold()

      window.addEventListener('resize', calcThreshold)

      return () => {
        window.removeEventListener('resize', calcThreshold);
      };

    }
  }, [props.primaryView, props.viewName])



  const [isPreview, setIsPreview] = useState<boolean>(true)

  useEffect(() => {

    if (props.viewName !== props.primaryView) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const height = entry.contentRect.height;
          const width = entry.contentRect.width

          const currentWidthThreshold = props.isSearching || props.stagingState === "open" ? (widthThreshold / 2) : widthThreshold
          if (width >= currentWidthThreshold - 50) {
            if (props.activeView.at(-1) === props.viewName) {
              setIsPreview(false)
              setCurrentCards(libraryItemCards)
              setCurrentFlexFlow('row wrap')
              setInnerContentStyle({

                height: "calc(100% - 45px)",
                transition: "1s",
                overflowY: 'auto',
                position: 'relative',
                margin: '0px 25px',
                background: "#141414"
              })
            }

          } else {
            setIsPreview(true)

            setInnerContentStyle({
              height: 'calc(100% - 45px)',
              transition: "1s",
              overflowY: 'auto',
              position: 'relative',
              margin: '0px 25px',
              background: "#141414"

            })
            setCurrentFlexFlow('row')

            setCurrentCards(libraryItemCards.slice(0, 5))

            if ((height < heightThreshold+50 ) && props.activeView.at(-1) === "Dashboard") {

              setInnerContentStyle({
                height: "calc((50vw * 0.25) + 50px)",
                transition: "1s",
                overflowY: 'clip',
                position: 'relative',
                margin: '0px 25px',
                background: "#141414"
              })
            }
          }
        }
      });

      if (libraryItemsContainer.current) {
        resizeObserver.observe(libraryItemsContainer.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }

  }, [libraryItemCards, innerContentStyle, heightThreshold, props.activeView, props.isSearching, props.stagingState, widthThreshold, props.viewName, props.primaryView])





  if ((props.viewName === props.primaryView) && libraryItems) {


    return (
      <>
        <div className="user-library-container" >
          <div style={{ display: 'inline-flex', width: "50vw", overflowX:'clip', alignItems: 'center', height: "45px" }}>
            <h2 style={{ margin: 0, color: "#878787", padding: "15px 0px 10px 25px" }}>
              {props.viewName === 'User Playlists' 
                  ? 'My Playlists' 
                  : props.viewName}
              </h2>
            {<button 
              onClick={props.activeView.at(-1)===props.viewName
                ?() => {props.setStagingState('closed'); props.setIsSearching(false); props.setActiveView(["Dashboard"]);}
                :() => props.setActiveView([props.viewName])} 
              style={props.activeView.at(-1) === 'Dashboard' 
                ? { transition: '1s', opacity: 1, height: "25px", width: "calc(50vw * .25)" } 
                : { transition: '1s', opacity: 1, height: "25px", width: "calc(50vw * .25)" }}>
              {props.activeView.at(-1)==="Dashboard"
                ?"View All"
                :"Dashboard"} {/* &#10238; */}
              </button>}
          </div>
          <div style={primaryContentStyle}>
            <div className="user-playlist-content" >
              {libraryItemCards}
            </div>
          </div>
        </div>
      </>
    )
  } else if (libraryItems) {

    return (
      <>
        <div ref={libraryItemsContainer} className="library-content-container" style={outterContainerStyle}>
          <div style={{ display: 'inline-flex', width: "50vw", overflowX:'clip', alignItems: 'center', height: "45px" }}>
            <h2 style={{ margin: 0, color: "#878787", padding: "15px 0px 10px 25px" }}>
              {props.viewName === 'User Playlists' ? 'My Playlists' : props.viewName}</h2>
            {<button 
              onClick={props.activeView.at(-1)===props.viewName
                ?() => {props.setStagingState('closed'); props.setIsSearching(false); props.setActiveView(["Dashboard"])}
                :() => props.setActiveView([props.viewName])} 
              style={currentCards?.length <= 5 && props.activeView.at(-1) === 'Dashboard' 
                ? { transition: '1s', opacity: 1, height: "25px", width: "calc(50vw * .25)"} 
                : { transition: '1s', opacity: 1, height: "25px", width: "calc(50vw * .25)" }}>
              {props.activeView.at(-1)==="Dashboard"
                ?"View All"
                :"Dashboard"}
            </button>}
          </div>
          <div style={innerContentStyle}>
            <div className="playlist-content" style={{ flexFlow: currentFlexFlow, height: isPreview ? "calc(100% - 50px)" : 'fit-content' }} >
              {currentCards}
            </div>
          </div>
        </div>
      </>
    )
  }
}
