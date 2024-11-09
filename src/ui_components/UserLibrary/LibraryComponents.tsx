import React, { useEffect, useState, useRef } from "react"
// import { Album } from '@spotify/web-api-ts-sdk';
// import UserLibrary from "../SinglePageView";
import { Album, Playlist } from "../../../server/types";
import TrackCollection from "../../models/libraryItems";
import LibraryItemCard from "./LibraryItemCard";
// import useRef from 'react';

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
        onPlaylistSelection: (selection: TrackCollection, currentView: string) => void
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
          
          const userPlaylistsClass: TrackCollection[] = userPlaylists.map((playlistObject:Playlist)=>new TrackCollection(playlistObject))
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
      const [currentCards, setCurrentCards] = useState(null)
      const [playlistCards, setPlaylistCards] = useState(null)
      const [threshold, setThreshold] = useState(null)

      const playlistsContainer = useRef(null)





      if(!likedPlaylistItems){
        const playlists: Playlist[] = fetchedPlaylistsResource.read()
        const likedPlaylists= playlists.filter((playlistObject:Playlist)=>
          playlistObject.owner.id !== props.userId
          )
          
          // const userPlaylistsClass: Library[] = myPlaylists.map((playlistObject:Playlist)=>new Library(playlistObject))
          const likedPlaylistsClass: TrackCollection[] = likedPlaylists.map((playlistObject:Playlist)=>new TrackCollection(playlistObject))
        setlikedPlaylistItems(likedPlaylistsClass)
        

      }

      useEffect(()=>{
        if(likedPlaylistItems){
          const cards = likedPlaylistItems?.map(singlePlaylist =>
            <LibraryItemCard setIsSearching={props.setIsSearching} key={singlePlaylist.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singlePlaylist} ownerId={""} selectedLibraryItemId={props.selectedLibraryItemId} currentView={"liked playlists"} ></LibraryItemCard>)
          setPlaylistCards(cards)
        }
      }, [likedPlaylistItems, props.setIsSearching, props.onPlaylistSelection, props.selectedLibraryItemId])
    

    const [likedPlaylistsStyle, setLikedPlaylistsStyle] = useState({
      width: props.stagingState==="open"||props.isSearching?"calc(25vw - 30px)":"calc(50vw - 37.5px)" ,
      height: "50%",
      // animation: "shrink-to-default-row 1s",
      transition: "1s"
    })
    const [likedContentStyle, setLikedContentStyle] = useState({height: "calc(50vh - 82px)",
      // animation: "shrink-to-default-albums",
      transition: "1s",
      overflowY:'clip' as 'auto'|'clip'    })


      useEffect(()=>{

          switch(props.activeView.at(-1)){
            case "dashboard":
              // setCurrentCards(playlistCards?.slice(0,3))
              setLikedContentStyle({
                height: "calc(50vh - 82px)",
                // animation: "shrink-to-default-albums",
                transition: "1s",
                overflowY:'clip'
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
              

              break;
            case "liked playlists":
              // setCurrentCards(playlistCards)
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

          }
 
      }, [props.stagingState, props.activeView, props.isSearching, playlistCards])

      useEffect(()=>{
        const calcThreshold = ()=> {
          setThreshold((50/100)*window.innerHeight)
        }

        calcThreshold()

        window.addEventListener('resize', calcThreshold)

        return () => {
          window.removeEventListener('resize', calcThreshold);
        };
       },[])


      useEffect(()=>{

      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const height = entry.contentRect.height;
          console.log('Observed height:', height);
          if (height < threshold) {
            // setCurrentCards(playlistCards.slice(0,3))
            const previewContentStyle = {...likedContentStyle, overflowY: 'clip' as "clip"}
            setLikedContentStyle(previewContentStyle)
          } else {
            const fullContentStyle = {...likedContentStyle, overflowY: 'auto' as "auto"}
            setLikedContentStyle(fullContentStyle)
            // setCurrentCards(playlistCards)
          }
        }
      });

      if (playlistsContainer.current) {
        resizeObserver.observe(playlistsContainer.current);
      }


      return () => {
        resizeObserver.disconnect();
      };
      },[likedContentStyle, playlistCards, threshold])

        
  
      if(likedPlaylistItems){

          return (
              <>

  
              <div ref={playlistsContainer} className="library-content-container" style={likedPlaylistsStyle}>
                <h2 style={{margin:0, color:"#878787", padding: "15px 0px 10px 25px"}}>Liked Playlists</h2>

                <div style={likedContentStyle}>
                <div className="playlist-content" >
                {playlistCards}
                </div>
                </div>
              </div>
  
              </>
          )
        }
}

    export const AlbumsComponent : React.FC<LibraryComponentProps> = (props:LibraryComponentProps)=>{
      const [albumItems, setAlbumItems] =useState(null)
      const [currentCards, setCurrentCards] = useState(null)
      const [albumCards, setAlbumCards] = useState(null)
      const [threshold, setThreshold] = useState(null)

      const albumsContainer = useRef(null)

      // const albumData : Album[] = fetchedAlbumsResource.read()
      // console.log("RESOURCE: ",albums)

        if(!albumItems){
          const albums : Album[] = fetchedAlbumsResource.read()
          const albumClasslist =  albums.map((album:Album)=>{
            return new TrackCollection(album['album'])})
          setAlbumItems(albumClasslist)
        }

        useEffect(()=>{
          if(albumItems){
            const cards = albumItems?.map(album =>
              <LibraryItemCard setIsSearching={props.setIsSearching} key={album.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={album} ownerId={""} selectedLibraryItemId={props.selectedLibraryItemId} currentView={"liked playlists"} ></LibraryItemCard>)
            setAlbumCards(cards)
          }
        }, [props.setIsSearching, props.onPlaylistSelection, props.selectedLibraryItemId, albumItems])
     
      
        const [likedAlbumsStyle, setLikedAlbumsStyle] = useState({
          width: props.stagingState==="open"||props.isSearching?"calc(25vw - 37.5px)":"calc(50vw - 37.5px)",
          height: "50%",
          // animation: "shrink-to-default-row 1s",
          transition: "1s",
        }
        )
        const [albumContentStyle, setAlbumContentStyle] = useState({
          height: "calc(50vh - 82px)",
          // animation: "shrink-to-default-albums",
          transition: "1s",
          overflowY: 'clip' as 'auto'|'clip'
        })


        useEffect(()=>{

          switch(props.activeView.at(-1)){
            case "dashboard":
              setAlbumContentStyle({
                height: "calc(50vh - 82px)",
                // animation: "shrink-to-default-albums",
                transition: "1s",
                overflowY: 'clip'
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

        useEffect(()=>{
        const calcThreshold = ()=> {
          setThreshold((50/100)*window.innerHeight)
        }

        calcThreshold()

        window.addEventListener('resize', calcThreshold)

        return () => {
          window.removeEventListener('resize', calcThreshold);
        };
       },[])


      useEffect(()=>{

      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const height = entry.contentRect.height;
          console.log('Observed height:', height);
          if (height < threshold) {
            // setCurrentCards(albumCards.slice(0,3))
            // albumContentStyle.overflowY = 'clip'
            const previewContentStyle = {...albumContentStyle, overflowY: 'clip' as "clip"}
            setAlbumContentStyle(previewContentStyle)
          } else {
            const fullContentStyle = {...albumContentStyle, overflowY: 'auto' as "auto"}
            setAlbumContentStyle(fullContentStyle)
            // setCurrentCards(albumCards)

          }
        }
      });

      if (albumsContainer.current) {
        resizeObserver.observe(albumsContainer.current);
      }


      return () => {
        resizeObserver.disconnect();
      };
      },[albumCards, albumContentStyle, threshold])

       

   
  
          if(albumItems){

            // const albumCards = albumItems.map(singleAlbum =>
              // <LibraryItemCard setIsSearching={props.setIsSearching} key={singleAlbum.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singleAlbum} ownerId={""} selectedLibraryItemId={props.selectedLibraryItemId} currentView={"liked albums"} ></LibraryItemCard>)

            // const previewCards = albumCards.slice(0, 3)
        //     if(albumContentStyle.overflowY ==='clip'){
        //       console.log('CONTENT CLIPPED:',albumContentStyle.overflowY)
        //     // <button>View All</button>
        //   }else{
        //   // <></>
        // }
              
              return (
                <>
                <div ref={albumsContainer} className="library-content-container" style={likedAlbumsStyle}>
                  <h2 style={{margin:0, color:"#878787", padding: "15px 0px 10px 25px"}}>Liked Albums</h2>
                  <div style={albumContentStyle}>
                  <div className="playlist-content" >
                    {/* {props.activeView.at(-1)==="liked albums"?albumCards:previewCards}
                      {/* {albumItems.map(singleAlbum =>
                          <LibraryItemCard setIsSearching={props.setIsSearching} key={singleAlbum.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singleAlbum} ownerId={""} selectedLibraryItemId={props.selectedLibraryItemId} currentView={"liked albums"} ></LibraryItemCard>)
                          } */} {albumCards}
                  </div>
                                    
                  </div>
                  {/* {albumContentStyle.overflowY ==='clip'as 'clip'|'auto'?<button>View All</button>:<></>} */}

                </div>
                </>
            )
              
            }
  
      
         
  
  }
// export PlaylistsComponents