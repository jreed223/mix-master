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
        userId: string,
        onPlaylistSelection: (selection: Library) => void
        activeView: string[]
    }
    
    export const UserPlaylistsComponent : React.FC<LibraryComponentProps> = (props:LibraryComponentProps)=>{
    const [userPlaylistsItems, setUserPlaylistsItems] = useState(null)
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
    // const playlists : Playlist[] = fetchedPlaylistsResource.read()
    // console.log("RESOURCE: ",playlists)


        // const likedPlaylistsClass: Library[] = likedPlaylists.map((playlistObject:Playlist)=>new Library(playlistObject))
        


    if(userPlaylistsItems){

      return (
        <>
        <div className="user-library-container">
          <h2 style={{margin:0}}>My Playlists</h2>
          <div className="user-playlist-content" style={props.activeView.at(-1)!=="user playlists"||"dashboard"?{padding: "0%"}:{}}>
              {userPlaylistsItems.map(singlePlaylist =>
                  <LibraryItemCard key={singlePlaylist.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singlePlaylist} ownerId={props.userId} ></LibraryItemCard>)
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
      const shrinkToDefault = {
        height: "50%",
        animation: "shrink-to-default-row 1s"
      }
    
    const growToDefault = {
    width: "50%",
    animation: "grow-to-default 1s",
    transition: "1s"
    }
    
    const shrinkFromDeafault = {
        width: "0%",
        animation: "shrink-from-default 1s",
        transition: "1s"
    }
    
    const growFromDefault = {
        width: "100%",
        animation: "grow-from-default 1s",
        transition: "1s"
    }
    
    const active = {
        width: "100%",
        animation: "grow-columns 1s",
        transition: "1s"
    }
    const inactive = {
        width: "0%",
        animation: "shrink-columns 1s",
        transition: "1s"
    }
    // let userPlaylistStyles ;
    // let likedPlaylistsStyle;
    

    const [likedPlaylistsStyle, setLikedPlaylistsStyle] = useState({})

    useEffect(()=>{


      if(props.activeView.at(-1)==="dashboard"){ //navigating to dashboard

        switch(props.activeView.at(-2)){
   case "user playlists":
         if(props.activeView.at(-3)==="liked playlists"){
           setLikedPlaylistsStyle({
             height: "50%",
             animation: "shrink-to-default-row 1s",
             transition: "1s"
           })
             }else if(props.activeView.at(-3)==="liked albums"){
              setLikedPlaylistsStyle({
                 height: "50%",
                 animation: "grow-to-default-row 1s",
                 transition: "1s"
               }   )
             }
       break;
   case "liked playlists":
     // userPlaylistStyles = 
     setLikedPlaylistsStyle({
       height: "50%",
       animation: "shrink-to-default-row 1s",
       transition: "1s"
     })
       break;
   case "liked albums":
    setLikedPlaylistsStyle({
       height: "50%",
       animation: "grow-to-default-row 1s",
       transition: "1s"
     })
       break;
}


}else if(props.activeView.at(-2)==="dashboard"){ //navigating from dashboard

 switch(props.activeView.at(-1)){
   case "user playlists":
        //  likedPlaylistsStyle={}
       break;
   case "liked playlists":
     // userPlaylistStyles = 
     setLikedPlaylistsStyle({
       height: "100%",
       animation: "grow-from-default-row 1s",
       transition: "1s"
     })
       break;
   case "liked albums":
    setLikedPlaylistsStyle({
       height: "0%",
       animation: "shrink-from-default-row 1s",
       transition: "1s"
     })
       break;
}
   

}
else if (props.activeView.at(-2)==="liked playlists"||"liked albums"){ //navigating row liked card

 switch(props.activeView.at(-1)){
   case "liked playlists":
    setLikedPlaylistsStyle({
       height: "100%",
       animation: "grow-row 1s",
       transition: "1s"
     })
     break;
   case "liked albums":
    setLikedPlaylistsStyle({
       height: "0%",
       animation: "shrink-row 1s",
       transition: "1s"
     })
     break;

 }
}else if (props.activeView.at(-2)==="user playlists"){ //navigating from to liked row

 switch(props.activeView.at(-1)){
   case "liked playlists":
     if(props.activeView.at(-3)!=="liked playlists"){
      setLikedPlaylistsStyle({
       height: "100%",
       animation: "grow-row 1s",
       transition: "1s"
     })
   }
     break;
   case "liked albums":
     if(props.activeView.at(-3)==="liked playlists"){
      setLikedPlaylistsStyle({
         height: "0%",
         animation: "shrink-row 1s",
         transition: "1s"
       })
     }
     
     break;

 }
}

    }, [props.activeView])
    
        
  
      if(likedPlaylistItems){
        

          return (
              <>

  
              <div className="library-content-container" style={likedPlaylistsStyle}>
                <h2 style={{margin:0}}>Liked Playlists</h2>
                <div className="playlist-content" style={props.activeView.at(-1)==="liked albums"?{padding: "0%"}:{}}>
                    {likedPlaylistItems.map(singlePlaylist =>
                        <LibraryItemCard key={singlePlaylist.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singlePlaylist} ownerId={""} ></LibraryItemCard>)}
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
      
        const [likedAlbumsStyle, setLikedAlbumsStyle] = useState({})

        useEffect(()=>{
    
    
          if(props.activeView.at(-1)==="dashboard"){ //navigating to dashboard
    
            switch(props.activeView.at(-2)){
       case "user playlists":
             if(props.activeView.at(-3)==="liked albums"){
               setLikedAlbumsStyle({
                 height: "50%",
                 animation: "shrink-to-default-row 1s",
                 transition: "1s"
               })
                 }else if(props.activeView.at(-3)==="liked playlists"){
                  setLikedAlbumsStyle({
                     height: "50%",
                     animation: "grow-to-default-row 1s",
                     transition: "1s"
                   }   )
                 }
           break;
       case "liked albums":
         // userPlaylistStyles = 
         setLikedAlbumsStyle({
           height: "50%",
           animation: "shrink-to-default-row 1s",
           transition: "1s"
         })
           break;
       case "liked playlists":
        setLikedAlbumsStyle({
           height: "50%",
           animation: "grow-to-default-row 1s",
           transition: "1s"
         })
           break;
    }
    
    
    }else if(props.activeView.at(-2)==="dashboard"){ //navigating from dashboard
    
     switch(props.activeView.at(-1)){
       case "user playlists":
            //  likedPlaylistsStyle={}
           break;
       case "liked albums":
         // userPlaylistStyles = 
         setLikedAlbumsStyle({
           height: "100%",
           animation: "grow-from-default-row 1s",
           transition: "1s"
         })
           break;
       case "liked playlists":
        setLikedAlbumsStyle({
           height: "0%",
           animation: "shrink-from-default-row 1s",
           transition: "1s"
         })
           break;
    }
       
    
    }
    else if (props.activeView.at(-2)==="liked playlists"||"liked albums"){ //navigating row liked card
    
     switch(props.activeView.at(-1)){
       case "liked albums":
        setLikedAlbumsStyle({
           height: "100%",
           animation: "grow-row 1s",
           transition: "1s"
         })
         break;
       case "liked playlists":
        setLikedAlbumsStyle({
           height: "0%",
           animation: "shrink-row 1s",
           transition: "1s"
         })
         break;
    
     }
    }else if (props.activeView.at(-2)==="user playlists"){ //navigating from to liked row
    
     switch(props.activeView.at(-1)){
       case "liked albums":
         if(props.activeView.at(-3)!=="liked albums"){
          setLikedAlbumsStyle({
           height: "100%",
           animation: "grow-row 1s",
           transition: "1s"
         })
       }
         break;
       case "liked playlist":
         if(props.activeView.at(-3)==="liked albums"){
          setLikedAlbumsStyle({
             height: "0%",
             animation: "shrink-row 1s",
             transition: "1s"
           })
         }
         
         break;
    
     }
    }
    
        }, [props.activeView])
  
      // const albumClasslist =  albums.map((album:Album)=>{
      //   return new Library(album['album'])})
  //   //setalbumList(albumClasslist)
      const styles = {
        libraryContentContainer:{
          height: "33%",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          /* overflow-x: scroll; */
        },
        playlistContent:{
          flex: 1,
          gap: "25px",
          display: "flex",
          /* flex-flow: row wrap; */
          /* max-width: 100%; */
          /* height: 82%; */
          justifyContent: "flex-start",
          overflowX: "scroll",
      
        }

      }
      
      const active = {
        height: "100%"
      }
      const inactive = {
        height: "0%"
      }
   
  
          if(albumItems){
            
              
              return (
                <>
                <div className="library-content-container" style={likedAlbumsStyle}>
                  <h2 style={{margin:0}}>Liked Albums</h2>
                  <div className="playlist-content" style={props.activeView.at(-1)==="liked playlists"?{padding: "0%"}:{}}>
                      {albumItems.map(singleAlbum =>
                          <LibraryItemCard key={singleAlbum.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singleAlbum} ownerId={""} ></LibraryItemCard>)
                          }
                  </div>
                </div>
                </>
            )
              
            }
  
      
         
  
  }
// export PlaylistsComponents