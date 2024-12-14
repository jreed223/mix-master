import React, { useEffect, useState, useRef, useContext } from "react"
import TrackCollection from "../../../models/libraryItems";
import LibraryItemCard from "./LibraryItemCard";
import { ViewName } from "../../../state_management/NavigationProvider";
import { NavigationContext } from "../../../state_management/NavigationProvider";
import { NavigationContextType } from '../../../state_management/NavigationProvider';
import { LibraryItemCardProps } from './LibraryItemCard';
import { Playlist } from '../../../../server/types';



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
  
  const {  selectedLibraryItem, } = useContext<NavigationContextType>(NavigationContext)


  // const libraryItemsContainer = useRef(null)

  let libraryCollections: TrackCollection[];


  if (!libraryItems) {

        const playlists1: Playlist[] = props.fetchedLibraryResource.read()
        const likedPlaylists = playlists1.filter((playlistObject: Playlist) =>
          playlistObject && playlistObject?.id 
        )
        
        libraryCollections = likedPlaylists.map((playlistObject: Playlist) => {
          const likedPlaylistCollection = new TrackCollection(playlistObject)

          
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
    
  }, [ selectedLibraryItem?.id, props.viewName, props.userId, libraryItems])






if ((libraryItems) ) {

    return (
      <>
        <div className="library-content-container" style={{
    width:"100%",
    transition: "1s",
  }}>
         
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
