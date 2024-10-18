import React, { useEffect, useState } from "react"
// import { Album } from '@spotify/web-api-ts-sdk';
// import UserLibrary from "../SinglePageView";
import { Album, Playlist } from "../../../server/types";
import Library from "../../models/libraryItems";
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
        isSearching: boolean
        setIsSearching: React.Dispatch<React.SetStateAction<boolean>>
    }
    
    export const UserPlaylistsComponent : React.FC<LibraryComponentProps> = (props:LibraryComponentProps)=>{
    const [userPlaylistsItems, setUserPlaylistsItems] = useState(null)
    const [userPlaylistsStyle, setUserPlaylistsStyle] = useState({})
  
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
        width: props.stagingState==="open"||props.isSearching?"50vw":"100vw",
        transition:"1s",
        overflowY:"auto"

      }
      const shrinkToDefault = {
        width: props.stagingState==="open"||props.isSearching?"25vw":"50vw",
        transition:"1s",
        overflowY:"auto"
      }
      console.log(props.activeView.at(-1)!=="user playlists")
      if(props.activeView.at(-1)==="dashboard"){
        setUserPlaylistsStyle(shrinkToDefault)
      }else if(props.activeView.at(-1)==="user playlists"){
        setUserPlaylistsStyle(growFromDefault)

      }

    },[props.activeView, props.isSearching, props.stagingState])

    if(userPlaylistsItems){

      return (
        <>
        <div className="user-library-container" >
          <h2 style={{margin:0, color:"#878787", padding: "15px 0px 10px 25px"}}>My Playlists</h2>
          <div style={userPlaylistsStyle}>
          <div className="user-playlist-content" >
            {/* <div className="user-flexbox-container"> */}
                  {userPlaylistsItems.map(singlePlaylist =>
                  <LibraryItemCard setIsSearching={props.setIsSearching} key={singlePlaylist.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singlePlaylist} ownerId={props.userId} selectedLibraryItemId={props.selectedLibraryItemId} currentView={"user playlists"} ></LibraryItemCard>)
                  }
          {/* </div> */}
          </div>
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
      width: props.stagingState==="open"||props.isSearching?"calc(25vw - 30px)":"calc(50vw - 37.5px)" ,
      height: "50%",
      // animation: "shrink-to-default-row 1s",
      transition: "1s"
    })
    const [likedContentStyle, setLikedContentStyle] = useState({height: "calc(50vh - 82px)",
      // animation: "shrink-to-default-albums",
      transition: "1s",
      overflowY:'auto' as 'auto'    })

      useEffect(()=>{

          switch(props.activeView.at(-1)){
            case "dashboard":
              setLikedContentStyle({
                height: "calc(50vh - 82px)",
                // animation: "shrink-to-default-albums",
                transition: "1s",
                overflowY:'auto'
              })

              if(props.stagingState==="open"){
                const playlistStyle = {
                  width: "25vw",
                  height:"50%",
                  transition: "1s"

                }
                setLikedPlaylistsStyle(playlistStyle)

              }else{
                const playlistStyle = {
                  width: "50vw",
                  height:"50%",
                  transition: "1s"

                }
                setLikedPlaylistsStyle(playlistStyle)

              }
              

              // setLikedPlaylistsStyle({
              //   width: props.stagingState==="open"?"25vw":"50vw",
              //   height: "50%",
              //   transition: "1s"
              // })
              break;
            case "liked playlists":
              setLikedContentStyle({
                height: "calc(100vh - 107px)",
                // animation: "grow-from-default-albums",
                overflowY:'auto',
                transition: "1s"
          
               })

              if(props.stagingState==="open"||props.isSearching){
                const playlistStyle = {
                  width: "50vw",
                  height:"100%",
                  transition: "1s"

                }
                setLikedPlaylistsStyle(playlistStyle)

              }else{
                const playlistStyle = {
                  width: "100vw",
                  height:"100%",
                  transition: "1s"

                }
                setLikedPlaylistsStyle(playlistStyle)

              }


              // setLikedPlaylistsStyle({
              //   width: props.stagingState==="open"||props.isSearching?"50vw":"100vw",
              //   height: "100%",
              //   transition: "1s"
              // })
              break;
            case "liked albums":
              if(props.stagingState==="open"||props.isSearching){
                const playlistStyle = {
                  width: "50vw",
                  height:"0%",
                  transition: "1s"

                }
                setLikedPlaylistsStyle(playlistStyle)

              }else{
                const playlistStyle = {
                  width: "100vw",
                  height:"0%",
                  transition: "1s"

                }
                setLikedPlaylistsStyle(playlistStyle)

              }

              // setLikedPlaylistsStyle({
              //   width: props.stagingState==="open"||props.isSearching?"50vw":"100vw",
              //   height: "0%",
              //   transition: "1s"
              // })

          }
 
      }, [props.stagingState, props.activeView, props.isSearching])


        
  
      if(likedPlaylistItems){
        

          return (
              <>

  
              <div className="library-content-container" style={likedPlaylistsStyle}>
                <h2 style={{margin:0, color:"#878787", padding: "15px 0px 10px 25px"}}>Liked Playlists</h2>

                <div style={likedContentStyle}>
                <div className="playlist-content" >
                    {likedPlaylistItems.map(singlePlaylist =>
                        <LibraryItemCard setIsSearching={props.setIsSearching} key={singlePlaylist.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singlePlaylist} ownerId={""} selectedLibraryItemId={props.selectedLibraryItemId} currentView={"liked playlists"} ></LibraryItemCard>)}
                </div>
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
          width: props.stagingState==="open"||props.isSearching?"calc(25vw - 37.5px)":"calc(50vw - 37.5px)",
          height: "50%",
          // animation: "shrink-to-default-row 1s",
          transition: "1s"
        }
        )
        const [albumContentStyle, setAlbumContentStyle] = useState({
          height: "calc(50vh - 82px)",
          // animation: "shrink-to-default-albums",
          transition: "1s",
          overflowY: 'auto' as 'auto'
        })


        useEffect(()=>{

          switch(props.activeView.at(-1)){
            case "dashboard":
              setAlbumContentStyle({
                height: "calc(50vh - 82px)",
                // animation: "shrink-to-default-albums",
                transition: "1s",
                overflowY: 'auto'
              })

              if(props.stagingState==="open"){
                const albumStyle = {
                  width: "25vw",
                  height:"50%",
                  transition: "1s"

                }
                setLikedAlbumsStyle(albumStyle)

              }else{
                const albumStyle = {
                  width: "50vw",
                  height:"50%",
                  transition: "1s"

                }
                setLikedAlbumsStyle(albumStyle)

              }
              // setLikedAlbumsStyle({
              //   width: props.stagingState==="open"?"25vw":"50vw",
              //   height: "50%",
              //   transition: "1s"
              // })
              break;
            case "liked albums":
              setAlbumContentStyle({
                height: "calc(100vh - 107px)",
                // animation: "grow-from-default-albums",
                transition: "1s",
                overflowY: 'auto'
          
               })

               if(props.stagingState==="open"||props.isSearching){
                const albumStyle = {
                  width: "50vw",
                  height:"100%",
                  transition: "1s"

                }
                setLikedAlbumsStyle(albumStyle)

              }else{
                const albumStyle = {
                  width: "100vw",
                  height:"100%",
                  transition: "1s"

                }
                setLikedAlbumsStyle(albumStyle)

              }
               
              // setLikedAlbumsStyle({
              //   width: props.stagingState==="open"||props.isSearching?"50vw":"100vw",
              //   height: "100%",
              //   transition: "1s"
              // })
              break;
            case "liked playlists":
              if(props.stagingState==="open"||props.isSearching){
                const albumStyle = {
                  width: "50vw",
                  height:"0%",
                  transition: "1s"

                }
                setLikedAlbumsStyle(albumStyle)

              }else{
                const albumStyle = {
                  width: "100vw",
                  height:"0%",
                  transition: "1s"

                }
                setLikedAlbumsStyle(albumStyle)

              }

            
              // setLikedAlbumsStyle({
              //   width: props.stagingState==="open"||props.isSearching?"50vw ":"100vw",
              //   height: "0%",
              //   transition: "1s"
              // })

          }
 
      }, [props.stagingState, props.activeView, props.isSearching])

       

   
  
          if(albumItems){
            
              
              return (
                <>
                <div className="library-content-container" style={likedAlbumsStyle}>
                  <h2 style={{margin:0, color:"#878787", padding: "15px 0px 10px 25px"}}>Liked Albums</h2>
                  <div style={albumContentStyle}>
                  <div className="playlist-content" >
                      {albumItems.map(singleAlbum =>
                          <LibraryItemCard setIsSearching={props.setIsSearching} key={singleAlbum.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singleAlbum} ownerId={""} selectedLibraryItemId={props.selectedLibraryItemId} currentView={"liked albums"} ></LibraryItemCard>)
                          }
                  </div>
                  </div>
                </div>
                </>
            )
              
            }
  
      
         
  
  }
// export PlaylistsComponents