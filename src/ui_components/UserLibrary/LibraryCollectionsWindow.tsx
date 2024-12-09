import React, { useEffect, useState, useRef, useContext } from "react"
import { Album, Playlist } from "../../../server/types";
import TrackCollection from "../../models/libraryItems";
import LibraryItemCard from "./LibraryItemCard";
import { ViewName } from "../NavBar";
import { NavigationContext, NavigationContextType } from "../../state_management/NavigationProvider";
import { DraftingContext } from "../../state_management/DraftingPaneProvider";
import { relative } from 'path';



interface LibraryItemsViewProps {
  userId: string,
  viewName: ViewName
  fetchedLibraryResource: {
    read(): any;
  }
}





export const LibraryItemsView: React.FC<LibraryItemsViewProps> = (props: LibraryItemsViewProps) => {
  const [libraryItems, setLibraryItems] = useState(null)
  const [currentCards, setCurrentCards] = useState<[]>(null)
  const [libraryItemCards, setLibraryItemCards] = useState(null)
  const [heightThreshold, setHeightThreshold] = useState(null)
  const [widthThreshold, setWidthThreshold] = useState(null)

  const {activeView, setActiveView, isSearching, setIsSearching, stagingState, setStagingState, primaryView, selectedLibraryItem} = useContext<NavigationContextType>(NavigationContext)

  // const {selectedLibraryItem} = useContext(DraftingContext)

  const libraryItemsContainer = useRef(null)

  let libraryCollections;
  const preloadImage = (src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  };

  if (!libraryItems) {
    switch (props.viewName) {
      case 'Liked Albums':
        const albums: Album[] = props.fetchedLibraryResource.read()
        libraryCollections = albums.map((album: Album | Playlist) => {
          const albumCollection = new TrackCollection(album['album'])
          if(albums.length>0){
            preloadImage(albumCollection.image.url)
          }
          return albumCollection
        })

        break;
      case 'Liked Playlists':
        const playlists1: Playlist[] = props.fetchedLibraryResource.read()
        const likedPlaylists = playlists1.filter((playlistObject: Playlist) =>
          playlistObject.owner.id !== props.userId
        )

        libraryCollections = likedPlaylists.map((playlistObject: Playlist) => {
          const likedPlaylistCollection = new TrackCollection(playlistObject)
          if(likedPlaylists.length>0){
            preloadImage(likedPlaylistCollection.image.url)
          }
          return likedPlaylistCollection
        })
        break;
      case 'User Playlists':
        const playlists2: Playlist[] = props.fetchedLibraryResource.read()
        const userPlaylists = playlists2.filter((playlistObject: Playlist) =>
          playlistObject.owner.id === props.userId
        )

        libraryCollections = userPlaylists.map((playlistObject: Playlist) =>{
          const userPlaylistCollection = new TrackCollection(playlistObject)
          if(userPlaylists.length>0){
            preloadImage(userPlaylistCollection.image.url)
          }
          return userPlaylistCollection
        } )
        break;
    }

    setLibraryItems(libraryCollections)
  }

  useEffect(() => {
    if (libraryItems) {
      const cards = libraryItems.map(item =>
        <LibraryItemCard key={item.id}  libraryItem={item} ownerId={props.userId} view={props.viewName} ></LibraryItemCard>)
      setLibraryItemCards(cards)
    }
  }, [setIsSearching, selectedLibraryItem?.id, libraryItems, props.viewName, props.userId])


  const [outterContainerStyle, setOutterContainerStyle] = useState({
    width: stagingState === "open" || isSearching ? "calc(25vw - 37.5px)" : "calc(50vw - 37.5px)",
    height: "50%",
    transition: "1s",
  })

  const [innerContentStyle, setInnerContentStyle] = useState({
    height: "80%",
    transition: "1s",
    overflowY: 'auto' as 'auto' | 'clip',
    position: 'relative' as 'relative',
    // margin: '0px 25px',
    // background: "#141414"
  })

  const [primaryContentStyle, setPrimaryContentStyle] = useState(null)




  useEffect(() => {
    if (props.viewName !== primaryView) {
      switch (activeView.at(-1)) {
        case "Dashboard":

          const dashboardHeight =
            stagingState === "open"
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
            (stagingState === "open" || isSearching)
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
        case primaryView:

          break;

        default:
          const hiddenHeight = (stagingState === "open" || isSearching)
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
        width: stagingState === "open" || isSearching ? "50vw" : "100vw",
        transition: "1s",
        overflowY: "auto"

      }
      const shrinkToDefault = {
        width: stagingState === "open" || isSearching ? "25vw" : "50vw",
        transition: "1s",
        overflowY: "auto"
      }
      console.log(activeView.at(-1) !== "User Playlists")
      if (activeView.at(-1) === "Dashboard") {
        setPrimaryContentStyle(shrinkToDefault)
      } else if (activeView.at(-1) === "User Playlists") {
        setPrimaryContentStyle(growFromDefault)

      }

    }
  }, [stagingState, activeView, isSearching, libraryItemCards, props.viewName, primaryView])

  const [currentFlexFlow, setCurrentFlexFlow] = useState('row')
  useEffect(() => {

    if (props.viewName !== primaryView) {
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
  }, [primaryView, props.viewName])



  const [isPreview, setIsPreview] = useState<boolean>(true)

  useEffect(() => {

    if (props.viewName !== primaryView) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const height = entry.contentRect.height;
          const width = entry.contentRect.width

          const currentWidthThreshold = isSearching || stagingState === "open" ? (widthThreshold / 2) : widthThreshold
          if (width >= currentWidthThreshold - 50) {
            if (activeView.at(-1) === props.viewName) {
              setIsPreview(false)
              setCurrentCards(libraryItemCards)
              setCurrentFlexFlow('row wrap')
              setInnerContentStyle({

                height: "calc(100% - 45px)",
                transition: "1s",
                overflowY: 'auto',
                position: 'relative',
                // margin: '0px 25px',
                // background: "#141414"
              })
            }

          } else {
            setIsPreview(true)

            setInnerContentStyle({
              height: 'calc(100% - 45px)',
              transition: "1s",
              overflowY: 'auto',
              position: 'relative',
              // margin: '0px 25px',
              // background: "#141414"

            })
            setCurrentFlexFlow('row')

            setCurrentCards(libraryItemCards.slice(0, 5))

            if ((height < heightThreshold+50 ) && activeView.at(-1) === "Dashboard") {

              setInnerContentStyle({
                height: "calc((50vw * 0.25) + 50px)",
                transition: "1s",
                overflowY: 'clip',
                position: 'relative',
                // margin: '0px 25px',
                // background: "#141414"
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

  }, [libraryItemCards, innerContentStyle, heightThreshold, activeView, isSearching, stagingState, widthThreshold, props.viewName, primaryView])





  if ((props.viewName === primaryView) && libraryItems) {


    return (
      <>
        <div className="user-library-container" >
          <div style={{ margin:"0px 25px", display: 'inline-flex', width: "calc(100% - 50px)", overflowX:'clip', alignItems: 'center', height: "45px", position: "relative" }}>
            <h2 style={{ margin: "15px 0px 5px", color: "#878787", padding: "0px 25px 0px 0px"  }}>
              {props.viewName === 'User Playlists' 
                  ? 'My Playlists' 
                  : props.viewName}
              </h2>
            {<button 
              onClick={activeView.at(-1)===props.viewName
                ?() => {setStagingState('closed'); setIsSearching(false); setActiveView(["Dashboard"]);}
                :() => setActiveView([props.viewName])} 
              style={activeView.at(-1) === 'Dashboard' 
                ? { transition: '1s', opacity: activeView.at(-1)==="Dashboard"?1:0, height: "25px", width: "calc(50vw * .25)", borderRadius:"25px", position: "absolute", top: "15px", left: "50%", transform: "translateX(-50%)"  } 
                : {  transition: '1s', opacity: activeView.at(-1)==="Dashboard"?1:0, height: "25px", width: "calc(50vw * .25)", borderRadius:"25px", position: "absolute", top: "15px", left: "50%", transform: "translateX(-50%)" }}>
              View All
            {/* &#10238; */}
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
          <div style={{ margin:"0px 25px", display: 'inline-flex', width: "calc(100% - 50px)", overflowX:'clip', alignItems: 'center', height: "45px", position: "relative" }}>
            <h2 style={{ margin: "15px 0px 5px", color: "#878787", padding: "0px 25px 0px 0px" }}>
              {props.viewName === 'User Playlists' ? 'My Playlists' : props.viewName}</h2>
              {<button
                onClick={activeView.at(-1)===props.viewName
                  ?() => {setStagingState('closed'); setIsSearching(false); setActiveView(["Dashboard"])}
                  :() => setActiveView([props.viewName])}
              
                style={currentCards?.length <= 5 && activeView.at(-1) === 'Dashboard'
                  ? { transition: '1s', animation:"fade-in 1s", opacity: activeView.at(-1)==="Dashboard"?1:0, height: "25px", width: "calc(50vw * .25)", borderRadius:"25px", position: "absolute", top: "15px", left: "50%", transform: "translateX(-50%)" }
                  : { transition: '1s', animation:"fade-in 1s", opacity: activeView.at(-1)==="Dashboard"?1:0, height: "25px", width: "calc(50vw * .25)", borderRadius:"25px", position: "absolute", top: "15px", left: "50%", transform: "translateX(-50%)"  }}>
                View All
                  
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
