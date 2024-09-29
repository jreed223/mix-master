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
        onPlaylistSelection: (selection: Library) => void
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
    // const playlists : Playlist[] = fetchedPlaylistsResource.read()
    // console.log("RESOURCE: ",playlists)


        // const likedPlaylistsClass: Library[] = likedPlaylists.map((playlistObject:Playlist)=>new Library(playlistObject))

        const shrinkOnOpen = {}
        
    useEffect(()=>{
      const growFromDefault ={
        width: props.stagingState==="open"?"calc(50vw - 50px)":"calc(100vw - 50px)",
        transition:"1s",
        // animation: "grow-from-default-user 1s"
      }
      const shrinkToDefault = {
        width: props.stagingState==="open"?"calc(25vw - 50px)":"calc(50vw - 50px)",

        // width: "calc(50vw - 50px)",
        transition:"1s",
        // animation: "shrink-to-default-user 1s"
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
        <div className="user-library-container">
          <h2 style={{margin:0, color:"#878787"}}>My Playlists</h2>
          <div className="user-playlist-content" style={userPlaylistsStyle}>
              {userPlaylistsItems.map(singlePlaylist =>
                  <LibraryItemCard key={singlePlaylist.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singlePlaylist} ownerId={props.userId} selectedLibraryItemId={props.selectedLibraryItemId} ></LibraryItemCard>)
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
    

    const [likedPlaylistsStyle, setLikedPlaylistsStyle] = useState({
      width: "50vw" ,
      height: "50%",
      // animation: "shrink-to-default-row 1s",
      transition: "1s"
    })
    const [likedContentStyle, setLikedContentStyle] = useState({height: "calc(50vh - 106px)",
      // animation: "shrink-to-default-albums",
      transition: "1s"})

    useEffect(()=>{

      const growRow = {
        width: props.stagingState==="open"?"50vw":"100vw",
        height: "100%",
        // animation: "grow-row 1s",
        transition: "1s"
      }

      if(props.activeView.at(-1)==="dashboard"){ //navigating to dashboard

        setLikedContentStyle({
          height: "calc(50vh - 106px)",
          // animation: "shrink-to-default-albums",
          transition: "1s"
        })

        switch(props.activeView.at(-2)){
   case "user playlists":
         if(props.activeView.at(-3)==="liked playlists"){
           setLikedPlaylistsStyle({
            width: props.stagingState==="open"?"25vw":"50vw",
            height: "50%",
            //  animation: "shrink-to-default-row 1s",
             transition: "1s"
           })
             }else if(props.activeView.at(-3)==="liked albums"){
              setLikedPlaylistsStyle({
                width: props.stagingState==="open"?"25vw":"50vw",
                height: "50%",
                //  animation: "grow-to-default-row 1s",
                 transition: "1s"
               }   )
             }
       break;
   case "liked playlists":
     // userPlaylistStyles = 
     setLikedPlaylistsStyle({
      width: props.stagingState==="open"?"25vw":"50vw",
      height: "50%",
      //  animation: "shrink-to-default-row 1s",
       transition: "1s"
     })
       break;
   case "liked albums":
    setLikedPlaylistsStyle({
      width: props.stagingState==="open"?"25vw":"50vw",
      height: "50%",
      //  animation: "grow-to-default-row 1s",
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
    setLikedContentStyle({
      height: "calc(100vh - 132px)",
      // animation: "grow-from-default-albums",
      transition: "1s"

     })
     // userPlaylistStyles = 
     setLikedPlaylistsStyle({
      width: props.stagingState==="open"?"50vw":"100vw",
       height: "100%",
      //  animation: "grow-from-default-row 1s",
       transition: "1s"
     })
       break;
   case "liked albums":
    setLikedPlaylistsStyle({
      width: props.stagingState==="open"?"50vw":"100vw",
       height: "0%",
      //  animation: "shrink-from-default-row 1s",
       transition: "1s"
     })
       break;
}
   

}
else if (props.activeView.at(-2)==="liked playlists"||props.activeView.at(-2)==="liked albums"){ //navigating row liked card

 switch(props.activeView.at(-1)){
   case "liked playlists":
    setLikedContentStyle({
      
      height: "calc(100vh - 132px)",
      // animation: "grow-from-default-albums",
      transition: "1s"

     })
    setLikedPlaylistsStyle({
      width: props.stagingState==="open"?"50vw":"100vw",
       height: "100%",
      //  animation: "grow-row 1s",
       transition: "1s"
     })
     break;
   case "liked albums":
    setLikedPlaylistsStyle({
      width: props.stagingState==="open"?"50vw":"100vw",
       height: "0%",
      //  animation: "shrink-row 1s",
       transition: "1s"
     }
    )
     break;

 }
}else if (props.activeView.at(-2)==="user playlists"){ //navigating from to liked row

 switch(props.activeView.at(-1)){
   case "liked playlists":
    //  if(props.activeView.at(-3)!=="liked playlists"){
      setLikedContentStyle({
        height: "calc(100vh - 132px)",
        // animation: "grow-from-default-albums",
        transition: "1s"

       })
       setLikedPlaylistsStyle((prev)=>JSON.stringify(prev.height)===JSON.stringify(growRow.height)?prev:growRow)

    //   setLikedPlaylistsStyle({
    //    height: "100%",
    //    animation: "grow-row 1s",
    //    transition: "1s"
    //  })
  //  }
     break;
   case "liked albums":
    //  if(props.activeView.at(-3)==="liked playlists"){
      setLikedPlaylistsStyle({
        width: props.stagingState==="open"?"50vw":"100vw",
        height: "0%",
        //  animation: "shrink-row 1s",
         transition: "1s"
       })
    //  }
     
     break;

 }
}

    }, [props.activeView, props.stagingState])
    
        
  
      if(likedPlaylistItems){
        

          return (
              <>

  
              <div className="library-content-container" style={likedPlaylistsStyle}>
                <h2 style={{margin:0, color:"#878787"}}>Liked Playlists</h2>
                <div className="playlist-content" style={likedContentStyle}>
                    {likedPlaylistItems.map(singlePlaylist =>
                        <LibraryItemCard key={singlePlaylist.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singlePlaylist} ownerId={""} selectedLibraryItemId={props.selectedLibraryItemId} ></LibraryItemCard>)}
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
          width: props.stagingState==="open"?"25vw":"50vw",
          height: "50%",
          // animation: "shrink-to-default-row 1s",
          transition: "1s"
        }
        )
        const [albumContentStyle, setAlbumContentStyle] = useState({
          height: "calc(50vh - 106px)",
          // animation: "shrink-to-default-albums",
          // transition: "1s"
        })
       

        useEffect(()=>{
          console.log("activeView: ", props.activeView)
          const defaultHeight = 
        {
          height: "calc(50vh - 106px)",
          // animation: "shrink-to-default-albums",
          transition: "1s"
        }
      
      const fullHeight = {
        height: "calc(100vh - 132px)",
        // animation: "grow-from-default-albums",
        transition: "1s"
       }

       const growRow = {
        width: props.stagingState==="open"?"50vw":"100vw",
        height: "100%",
        // animation: "grow-row 1s",
        transition: "1s"
      }
    
          if(props.activeView.at(-1)==="dashboard"){ //navigating to dashboard
            console.log("nav to dashboard")

            setAlbumContentStyle(defaultHeight)
    
            switch(props.activeView.at(-2)){
       case "user playlists":
             if(props.activeView.at(-3)==="liked albums"){
               setLikedAlbumsStyle({
                width: props.stagingState==="open"?"25vw":"50vw",
                height: "50%",
                //  animation: "shrink-to-default-row 1s",
                 transition: "1s"
               })
                 }else if(props.activeView.at(-3)==="liked playlists"){
                  setLikedAlbumsStyle({
                    width: props.stagingState==="open"?"25vw":"50vw",
                    height: "50%",
                    //  animation: "grow-to-default-row 1s",
                     transition: "1s"
                   }   )
                 }
           break;
       case "liked albums":
         // userPlaylistStyles = 
         setLikedAlbumsStyle({
          width: props.stagingState==="open"?"25vw":"50vw",
          height: "50%",
          //  animation: "shrink-to-default-row 1s",
           transition: "1s"
         })
           break;
       case "liked playlists":
        setLikedAlbumsStyle({
          width: props.stagingState==="open"?"25vw":"50vw",
          height: "50%",
          //  animation: "grow-to-default-row 1s",
           transition: "1s"
         })
           break;
    }
    
    
    }else if(props.activeView.at(-2)==="dashboard"){ //navigating from dashboard
      console.log("nav away from dashboard")

     switch(props.activeView.at(-1)){
       case "user playlists":
            //  likedPlaylistsStyle={}
           break;
       case "liked albums":
         // userPlaylistStyles = 
         setAlbumContentStyle((prev)=>prev.height!==fullHeight.height?fullHeight:prev)
         setLikedAlbumsStyle({
          width: props.stagingState==="open"?"50vw":"100vw",
          height: "100%",
          //  animation: "grow-from-default-row 1s",
           transition: "1s"
         })
           break;
       case "liked playlists":
        setLikedAlbumsStyle({
          width: props.stagingState==="open"?"50vw":"100vw",
           height: "0%",
          //  animation: "shrink-from-default-row 1s",
           transition: "1s"
         })
           break;
    }
       
    
    }
    else if (props.activeView.at(-2)==="liked playlists"||props.activeView.at(-2)==="liked albums"){ //navigating row liked card
      console.log("nav away from liked items")

     switch(props.activeView.at(-1)){
       case "liked albums":
        setAlbumContentStyle((prev)=>prev.height!==fullHeight.height?fullHeight:prev)
        setLikedAlbumsStyle((prev)=>prev.height!==growRow.height?growRow:prev)
         break;
       case "liked playlists":
        setLikedAlbumsStyle({
          width: props.stagingState==="open"?"50vw":"100vw",
           height: "0%",
          //  animation: "shrink-row 1s",
           transition: "1s"
         }
        )
         break;
    
     }
    }else if (props.activeView.at(-2)==="user playlists"){ //navigating from to liked row
      console.log("nav away from user created items")

     switch(props.activeView.at(-1)){
       case "liked albums":
        console.log("nav to liked items")
         if(props.activeView.at(-3)!=="liked albums"){
          console.log("Moved to liked albus!!!")
          setAlbumContentStyle((prev)=>prev.height!==fullHeight.height?fullHeight:prev)
          setLikedAlbumsStyle((prev)=>JSON.stringify(prev.height)===JSON.stringify(growRow.height)?prev:growRow)

       }
         break;
       case "liked playlists":
        //  if(props.activeView.at(-3)==="liked albums"){

        //   setLikedAlbumsStyle({
        //     width: "100vw",
        //      height: "0%",
        //      animation: "shrink-row 1s",
        //      transition: "1s"
        //    })
        //  }else{
          setLikedAlbumsStyle({
            width: props.stagingState==="open"?"50vw":"100vw",
            height: "0%",
            //  animation: "shrink-row 1s",
             transition: "1s"
           })

        //  }
         
         break;
    
     }
    }
    
        }, [props.activeView, props.stagingState])

        // useEffect(()=>{

          

        // })
  
      // const albumClasslist =  albums.map((album:Album)=>{
      //   return new Library(album['album'])})
  //   //setalbumList(albumClasslist)

   
  
          if(albumItems){
            
              
              return (
                <>
                <div className="library-content-container" style={likedAlbumsStyle}>
                  <h2 style={{margin:0, color:"#878787"}}>Liked Albums</h2>
                  <div className="playlist-content" style={albumContentStyle} >
                      {albumItems.map(singleAlbum =>
                          <LibraryItemCard key={singleAlbum.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singleAlbum} ownerId={""} selectedLibraryItemId={props.selectedLibraryItemId} ></LibraryItemCard>)
                          }
                  </div>
                </div>
                </>
            )
              
            }
  
      
         
  
  }
// export PlaylistsComponents