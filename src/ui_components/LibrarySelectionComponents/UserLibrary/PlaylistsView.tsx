import React, { useEffect, useState, useRef, useContext, useCallback } from "react"
import TrackCollection from "../../../models/TrackCollection.ts";
import LibraryItemCard from "./LibraryItemCard.tsx";
import { ViewName } from "../../../state_management/ViewProvider.tsx";
import { ViewContext } from "../../../state_management/ViewProvider.tsx";
import { ViewContextType } from '../../../state_management/ViewProvider.tsx';
import { LibraryItemCardProps } from './LibraryItemCard.tsx';
import { LikedTracks, Playlist, SearchResults } from '../../../../server/types.tsx';
import { DraftingContext, DraftingContextType } from "../../../state_management/DraftingPaneProvider.tsx";
import { likedTracks } from "../../../../server/SpotifyData/controllers/supplementalControllers/likedTracks.ts";
import { stringify, parse } from "flatted";



interface LibraryItemsViewProps {
  userId: string,
  viewName: ViewName
  libraryItems: TrackCollection[]
  savedTracks:TrackCollection
  nextLink:string|null
  setLibraryItems: React.Dispatch<React.SetStateAction<TrackCollection[]>>
  // fetchedLibraryResource: {
  //   read(): any;
  // }
  // reloadKey?: number
}





export const PlaylistsView: React.FC<LibraryItemsViewProps> = (props: LibraryItemsViewProps) => {
  // const [libraryItems, setLibraryItems] = useState<TrackCollection[]>(null)
  const [libraryItemCards, setLibraryItemCards] = useState<React.ReactElement<LibraryItemCardProps>[]>(null)
  // const [usersLikedTracks, setUsersLikedTracks] = useState<TrackCollection>(null)
  const [savedTracksCard, setSavedTracksCard] = useState<React.ReactElement<LibraryItemCardProps>>(null)
  const [nextPlaylistsLink, setNextPlaylistsLink] = useState(null)
  
  
  const {  selectedLibraryItem, } = useContext<DraftingContextType>(DraftingContext)
  const {user, isPlaylistsView, isMobile  } = useContext<ViewContextType>(ViewContext)






  const getNextPlaylists = async () =>{
      const playlistsList : SearchResults['playlists'] = await fetch("/spotify-data/next-playlists", {
                    method: "POST",
                    headers:{
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({next: nextPlaylistsLink})
                    // headers: {"id" : `${this.id}` }
                },
        ).then(async (res)=>{
                    console.log("get next playlists response: ", res)
    
                    const playlistsData = await res.json()
                    console.log("itemdata: ",playlistsData)
                    return playlistsData
                })
                const fetchedPlaylists = playlistsList.items.filter(playlist=>playlist&&playlist?.id).map(playlist=>new TrackCollection(playlist))
        props.setLibraryItems(props.libraryItems.concat(fetchedPlaylists))
        setNextPlaylistsLink(playlistsList.next)
  }





useEffect(()=>{
  if(props.nextLink){
    setNextPlaylistsLink(props.nextLink)
  }
},[props.nextLink])


  useEffect(() => {
    if (props.libraryItems) {
      const cards = props.libraryItems.map(item =>
        <LibraryItemCard key={item.id}  libraryItem={item} ownerId={props.userId} view={props.viewName} ></LibraryItemCard>)

      setLibraryItemCards(cards)
      return
   
    }
    
  }, [props.viewName, props.userId, props.libraryItems])

  useEffect(()=>{
    if(props.savedTracks){
      console.log("saved tracks",props.savedTracks)
      const likedTracksCard:React.ReactElement<LibraryItemCardProps>= (
        <LibraryItemCard key={props.savedTracks.id}  libraryItem={props.savedTracks} ownerId={props.userId} view={props.viewName} ></LibraryItemCard>
      )

     setSavedTracksCard(likedTracksCard)
    }
  }, [props.userId, props.viewName, props.savedTracks])








    return (
      <>
        <div className="library-content-container" style={{
    width:"100%",
    transition: "1s",
    display: isPlaylistsView?"block":"none"
  }}>
         
          <div style={{
    transition: "1s",
    overflowY: 'auto' as 'auto' | 'clip',
    position: 'relative' as 'relative',

  }}>
            <div className="playlist-content" style={{}} >
              {savedTracksCard?savedTracksCard:<></>}
              {libraryItemCards?libraryItemCards:<></>}
              {nextPlaylistsLink?<div style={{display:"flex",flexGrow:2, minWidth:"25vh", width:"calc(33% - 20px)"}}>
                <button  onClick={(e)=>{ e.preventDefault(); getNextPlaylists()}} style={{cursor:'pointer', margin: "auto", height: "100%", width: "100%", maxWidth:"75vh",minHeight: "10vh",  backgroundColor:"#212121", borderRadius: "30px"}} >More</button>
              </div>:<></>}
            </div>
          </div>
        </div>
      </>
    )
  
}
