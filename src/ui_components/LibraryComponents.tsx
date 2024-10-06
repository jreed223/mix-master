import React, { useEffect, useState } from "react"
import { Album, UserProfile } from '@spotify/web-api-ts-sdk';
import UserLibrary from "./UserLibrary";
import { Playlist } from "../../server/types";
import Library from "../models/libraryItems";
import AlbumCard from "./LibraryItemCard";
import LibraryItemCard from "./LibraryItemCard";

    const fetchAllPlaylists = ()=>{
        console.log("FETCHING PLAYLISTS")
        const playlistList = fetch("/spotify-data/playlists")
        .then(res=>res.json()).then((playlists)=>{
            console.log("PLAYLISTS: ", playlists)
            return playlists
        })
        return playlistList
        
    }

    const fetchLikedAlbums = ()=>{
      console.log("FETCHING PLAYLISTS")

      const res = fetch("/spotify-data/albums")
      .then(res=>res.json())
      .then(albums=>{
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


    interface LibraryComponentProps{
      selectedLibraryItemId: string|null,
        userId: string,
        onPlaylistSelection: (selection: Library, currentView: string) => void
        activeView: string[]
        stagingState: String
    }
    
    export const UserPlaylistsComponent : React.FC<LibraryComponentProps> = (props:LibraryComponentProps)=>{
    const [userPlaylistsItems, setUserPlaylistsItems] = useState(null)
    const [userPlaylistsStyle, setUserPlaylistsStyle] = useState({})
    // let myPlaylists = []
    // let likedPlaylists = []
    if(!userPlaylistsItems){
      const playlists : Playlist[] = fetchedPlaylistsResource.read()
      console.log("RESOURCE: ",playlists)
      const userPlaylists= playlists.filter((playlistObject:Playlist)=>
        playlistObject.owner.id === props.userId
        )
          
          const userPlaylistsClass: Library[] = userPlaylists.map((playlistObject:Playlist)=>new Library(playlistObject))
          setUserPlaylistsItems(userPlaylistsClass)
    }

        
    useEffect(()=>{
      const growFromDefault ={
        width: props.stagingState==="open"?"calc(50vw - 75px)":"calc(100vw - 100px)",
        transition:"1s",
      }
      const shrinkToDefault = {
        width: props.stagingState==="open"?"calc(25vw - 87.5px)":"calc(50vw - 87.5px)",
        transition:"1s",
      }
      console.log(props.activeView.at(-1)!=="user playlists")
      if(props.activeView.at(-1)==="dashboard"){
        setUserPlaylistsStyle(shrinkToDefault)
      }else if(props.activeView.at(-1)==="user playlists"){
        setUserPlaylistsStyle(growFromDefault)

      }

    },[props.activeView, props.stagingState])

    if(userPlaylistsItems){

      return (
        <>
        <div className="user-library-container" >
          <h2 style={{margin:0, color:"#878787"}}>My Playlists</h2>
          <div className="user-playlist-content" style={userPlaylistsStyle}>
              {userPlaylistsItems.map(singlePlaylist =>
                  <LibraryItemCard key={singlePlaylist.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singlePlaylist} ownerId={props.userId} selectedLibraryItemId={props.selectedLibraryItemId} currentView={"user playlists"} ></LibraryItemCard>)
                  }
          </div>
        </div>


        </>
    )
    }


    
    }

    export const LikedPlaylistsComponent : React.FC<LibraryComponentProps> = (props:LibraryComponentProps)=>{
      const [likedPlaylistItems, setlikedPlaylistItems] =useState(null)

      // let myPlaylists = []
      // let likedPlaylists = []
  
      // console.log("RESOURCE: ",playlists)

      if(!likedPlaylistItems){
        const playlists: Playlist[] = fetchedPlaylistsResource.read()
        const likedPlaylists= playlists.filter((playlistObject:Playlist)=>
          playlistObject.owner.id !== props.userId
          )
          
          // const userPlaylistsClass: Library[] = myPlaylists.map((playlistObject:Playlist)=>new Library(playlistObject))
          const likedPlaylistsClass: Library[] = likedPlaylists.map((playlistObject:Playlist)=>new Library(playlistObject))
        setlikedPlaylistItems(likedPlaylistsClass)

      }

    

    const [likedPlaylistsStyle, setLikedPlaylistsStyle] = useState({
      width: props.stagingState==="open"?"calc(25vw - 30px)":"calc(50vw - 37.5px)" ,
      height: "50%",
      // animation: "shrink-to-default-row 1s",
      transition: "1s"
    })
    const [likedContentStyle, setLikedContentStyle] = useState({height: "calc(50vh - 106px)",
      // animation: "shrink-to-default-albums",
      transition: "1s"})

      useEffect(()=>{

          switch(props.activeView.at(-1)){
            case "dashboard":
              setLikedContentStyle({
                height: "calc(50vh - 106px)",
                // animation: "shrink-to-default-albums",
                transition: "1s"
              })
              setLikedPlaylistsStyle({
                width: props.stagingState==="open"?"calc(25vw - 37.5px)":"calc(50vw - 37.5px)",
                height: "50%",
                transition: "1s"
              })
              break;
            case "liked playlists":
              setLikedContentStyle({
                height: "calc(100vh - 132px)",
                // animation: "grow-from-default-albums",
                transition: "1s"
          
               })
              setLikedPlaylistsStyle({
                width: props.stagingState==="open"?"calc(50vw - 25px)":"calc(100vw - 50px)",
                height: "100%",
                transition: "1s"
              })
              break;
            case "liked albums":
              setLikedPlaylistsStyle({
                width: props.stagingState==="open"?"calc(50vw - 25px)":"calc(100vw - 50px)",
                height: "0%",
                transition: "1s"
              })

          }
 
      }, [props.stagingState, props.activeView])


        
  
      if(likedPlaylistItems){
        

          return (
              <>

  
              <div className="library-content-container" style={likedPlaylistsStyle}>
                <h2 style={{margin:0, color:"#878787"}}>Liked Playlists</h2>
                <div className="playlist-content" style={likedContentStyle}>
                    {likedPlaylistItems.map(singlePlaylist =>
                        <LibraryItemCard key={singlePlaylist.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singlePlaylist} ownerId={""} selectedLibraryItemId={props.selectedLibraryItemId} currentView={"liked playlists"} ></LibraryItemCard>)}
                </div>
              </div>
  
              </>
          )
        }
}

    export const AlbumsComponent : React.FC<LibraryComponentProps> = (props:LibraryComponentProps)=>{
      const [albumItems, setAlbumItems] =useState(null)

      // const albumData : Album[] = fetchedAlbumsResource.read()
      // console.log("RESOURCE: ",albums)

        if(!albumItems){
          const albums : Album[] = fetchedAlbumsResource.read()
          const albumClasslist =  albums.map((album:Album)=>{
            return new Library(album['album'])})
          setAlbumItems(albumClasslist)
        }
     
      
        const [likedAlbumsStyle, setLikedAlbumsStyle] = useState({
          width: props.stagingState==="open"?"calc(25vw - 37.5px)":"calc(50vw - 37.5px)",
          height: "50%",
          // animation: "shrink-to-default-row 1s",
          transition: "1s"
        }
        )
        const [albumContentStyle, setAlbumContentStyle] = useState({
          height: "calc(50vh - 106px)",
          // animation: "shrink-to-default-albums",
          transition: "1s"
        })


        useEffect(()=>{

          switch(props.activeView.at(-1)){
            case "dashboard":
              setAlbumContentStyle({
                height: "calc(50vh - 106px)",
                // animation: "shrink-to-default-albums",
                transition: "1s"
              })
              setLikedAlbumsStyle({
                width: props.stagingState==="open"?"calc(25vw - 37.5px)":"calc(50vw - 37.5px)",
                height: "50%",
                transition: "1s"
              })
              break;
            case "liked albums":
              setAlbumContentStyle({
                height: "calc(100vh - 132px)",
                // animation: "grow-from-default-albums",
                transition: "1s"
          
               })
              setLikedAlbumsStyle({
                width: props.stagingState==="open"?"calc(50vw - 25px)":"calc(100vw - 50px)",
                height: "100%",
                transition: "1s"
              })
              break;
            case "liked playlists":
              setLikedAlbumsStyle({
                width: props.stagingState==="open"?"calc(50vw - 25px)":"calc(100vw - 50px)",
                height: "0%",
                transition: "1s"
              })

          }
 
      }, [props.stagingState, props.activeView])

       

   
  
          if(albumItems){
            
              
              return (
                <>
                <div className="library-content-container" style={likedAlbumsStyle}>
                  <h2 style={{margin:0, color:"#878787"}}>Liked Albums</h2>
                  <div className="playlist-content" style={albumContentStyle} >
                      {albumItems.map(singleAlbum =>
                          <LibraryItemCard key={singleAlbum.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singleAlbum} ownerId={""} selectedLibraryItemId={props.selectedLibraryItemId} currentView={"liked albums"} ></LibraryItemCard>)
                          }
                  </div>
                </div>
                </>
            )
              
            }
  
      
         
  
  }
// export PlaylistsComponents