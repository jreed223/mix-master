import React, { useEffect, useState, useRef, useContext } from "react"
import TrackCollection from "../../../models/TrackCollection";
import LibraryItemCard from "./LibraryItemCard";
import { ViewName } from "../../../state_management/ViewProvider";
import { ViewContext } from "../../../state_management/ViewProvider";
import { ViewContextType } from '../../../state_management/ViewProvider';
import { LibraryItemCardProps } from './LibraryItemCard';
import { LikedTracks, Playlist, SearchResults } from '../../../../server/types';
import { DraftingContext, DraftingContextType } from "../../../state_management/DraftingPaneProvider";
import { likedTracks } from "../../../../server/SpotifyData/controllers/supplementalControllers/likedTracks";



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
  const [savedTracksCard, setSavedTracksCard] = useState<React.ReactElement<LibraryItemCardProps>>(null)
  const [nextPlaylistsLink, setNextPlaylistsLink] = useState(null)
  
  
  const {  selectedLibraryItem, } = useContext<DraftingContextType>(DraftingContext)
  const {user, isPlaylistsView  } = useContext<ViewContextType>(ViewContext)


  // const libraryItemsContainer = useRef(null)


  const fetchAllPlaylists = async (reloadKey) => {
    const playlistList = await fetch("/spotify-data/playlists")
      .then(async res => await res.json()).then((playlists: SearchResults['playlists']) => {
        return playlists
      })

    const fetchedPlaylists = playlistList.items.filter(playlist=>playlist&&playlist?.id).map(playlist=>new TrackCollection(playlist))
    setLibraryItems(fetchedPlaylists)
    setNextPlaylistsLink(playlistList.next)
    // return playlistList
  }

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
        setLibraryItems(libraryItems.concat(fetchedPlaylists))
        setNextPlaylistsLink(playlistsList.next)
  }


  if (!libraryItems) {
    fetchAllPlaylists(props.reloadKey||0)

  }

  // useEffect(()=>{

  // })




useEffect(()=>{
  const fetchLikedTracks = async ()=>{
    const res = await fetch("/spotify-data/liked-tracks", {
      method: "GET"
  })
    if(res.ok){
      const tracks:LikedTracks = await res.json()
      tracks.type = "liked tracks"
      console.log("NEW COLLECTION!!! ",tracks)

      const newCollection = new TrackCollection(tracks)
      newCollection.owner = user
      console.log("NEW COLLECTION!!! ",newCollection)
      setUsersLikedTracks(newCollection)
    }else{
      
    }
  }

  if(!usersLikedTracks){
    fetchLikedTracks()
  }
}, [user, usersLikedTracks])



  useEffect(() => {
    if (libraryItems) {
      const cards = libraryItems.map(item =>
        <LibraryItemCard key={item.id}  libraryItem={item} ownerId={props.userId} view={props.viewName} ></LibraryItemCard>)
        // if(libraryItemCards){
        //   setLibraryItemCards([libraryItemCards.at(0)].concat(cards))
        // }else{
        //   setLibraryItemCards(cards)
        // }
      setLibraryItemCards(cards)
      return
   
    }
    
  }, [props.viewName, props.userId, libraryItems])

  useEffect(()=>{
    if(usersLikedTracks && !savedTracksCard){
      console.log(usersLikedTracks)
      const likedTracksCard:React.ReactElement<LibraryItemCardProps>= (
        <LibraryItemCard key={usersLikedTracks.id}  libraryItem={usersLikedTracks} ownerId={props.userId} view={props.viewName} ></LibraryItemCard>
      )

     setSavedTracksCard(likedTracksCard)
    }
  }, [libraryItemCards, props.userId, props.viewName, savedTracksCard, usersLikedTracks])








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
