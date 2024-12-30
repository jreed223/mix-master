import React, { useEffect, useState, useRef, useContext } from "react"
import TrackCollection from "../../../models/TrackCollection";
import LibraryItemCard from "./LibraryItemCard";
import { ViewName } from "../../../state_management/ViewProvider";
import { ViewContext } from "../../../state_management/ViewProvider";
import { ViewContextType } from '../../../state_management/ViewProvider';
import { LibraryItemCardProps } from './LibraryItemCard';
import { LikedTracks, Playlist } from '../../../../server/types';
import { DraftingContext, DraftingContextType } from "../../../state_management/DraftingPaneProvider";



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
  const [usersLikedTracks, setUsersLikedTracks] = useState<TrackCollection>(null)
  
  const {  selectedLibraryItem, } = useContext<DraftingContextType>(DraftingContext)


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


const fetchLikedTracks = async ()=>{
  const res = await fetch("/spotify-data/liked-tracks", {
    method: "GET"
})
  if(res.ok){
    const tracks:LikedTracks = await res.json()
    
    setUsersLikedTracks(new TrackCollection(tracks))
  }else{
    
  }
}
if(!usersLikedTracks){
  
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
