import React, { useEffect, useState, useRef, useContext } from "react"
import TrackCollection from "../models/libraryItems";
import LibraryItemCard from "./UserLibrary/LibraryItemCard";
import { ViewName } from "../state_management/NavigationProvider";
import { NavigationContext } from "../state_management/NavigationProvider";
import { relative } from 'path';
import { NavigationContextType } from '../state_management/NavigationProvider';
import { LibraryItemCardProps } from './UserLibrary/LibraryItemCard';
import { Album, Playlist } from '../../server/types';



interface LibraryItemsViewProps {
  userId: string,
  viewName: ViewName
  fetchedLibraryResource: {
    read(): any;
  }
  reloadKey?: number
}





export const PlaylistsView: React.FC<LibraryItemsViewProps> = (props: LibraryItemsViewProps) => {
  const [libraryItems, setLibraryItems] = useState<TrackCollection[]>(null)
  const [libraryItemCards, setLibraryItemCards] = useState<React.ReactElement<LibraryItemCardProps>[]>(null)
  
  const {activeView, setActiveView, isSearching, setIsSearching, stagingState, setStagingState, primaryView, selectedLibraryItem, userLibraryItems, setUserLibraryItems, isMobile} = useContext<NavigationContextType>(NavigationContext)

  // const {selectedLibraryItem} = useContext(DraftingContext)

  const libraryItemsContainer = useRef(null)

  let libraryCollections: TrackCollection[];
  const preloadImage = (src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  };

  if (!libraryItems) {

        const playlists1: Playlist[] = props.fetchedLibraryResource.read()
        const likedPlaylists = playlists1.filter((playlistObject: Playlist) =>
          playlistObject && playlistObject?.id 
        )
        
        libraryCollections = likedPlaylists.map((playlistObject: Playlist) => {
          const likedPlaylistCollection = new TrackCollection(playlistObject)
          if(likedPlaylists.length>0){
            preloadImage(likedPlaylistCollection.image.url)
          }
          
          return likedPlaylistCollection
        })
        setLibraryItems(libraryCollections)

      

  }


  useEffect(() => {
    if (libraryItems) {
      const cards = libraryItems.map(item =>
        <LibraryItemCard key={item.id}  libraryItem={item} ownerId={props.userId} view={props.viewName} ></LibraryItemCard>)
      setLibraryItemCards(cards)
      return
   
    }
    
  }, [setIsSearching, selectedLibraryItem?.id, props.viewName, props.userId, libraryItems])






if ((libraryItems||userLibraryItems) ) {

    return (
      <>
        <div ref={libraryItemsContainer} className="library-content-container" style={{
    width:"100%",
    transition: "1s",
  }}>
          {/* <div style={{ margin:"0px 25px", display: 'inline-flex', width: "calc(100% - 50px)", overflowX:'clip', alignItems: 'center', height: "45px", position: "relative" }}>
            <h2 style={{ margin: "15px 0px 5px", color: "#878787", padding: "0px 25px 0px 0px" }}>
              {props.viewName === 'User Playlists' ? 'My Playlists' : props.viewName}</h2>
          </div> */}
          <div style={{
    transition: "1s",
    overflowY: 'auto' as 'auto' | 'clip',
    position: 'relative' as 'relative',

  }}>
            <div className="playlist-content" style={{}} >
              {libraryItemCards}
            </div>
          </div>
        </div>
      </>
    )
  }
}
