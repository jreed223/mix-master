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
    }
    
    export const UserPlaylistsComponent : React.FC<LibraryComponentProps> = (props:LibraryComponentProps)=>{

    // let myPlaylists = []
    // let likedPlaylists = []

    const playlists : Playlist[] = fetchedPlaylistsResource.read()
    console.log("RESOURCE: ",playlists)

    const userPlaylists= playlists.filter((playlistObject:Playlist)=>
      playlistObject.owner.id === props.userId
      )
        
        const userPlaylistsClass: Library[] = userPlaylists.map((playlistObject:Playlist)=>new Library(playlistObject))
        // const likedPlaylistsClass: Library[] = likedPlaylists.map((playlistObject:Playlist)=>new Library(playlistObject))


    
        return (
            <>
            <div className="user-library-container">
              <h2 style={{margin:0}}>My Playlists</h2>
              <div className="user-playlist-content">
                  {userPlaylistsClass.map(singlePlaylist =>
                      <LibraryItemCard key={singlePlaylist.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singlePlaylist} ownerId={props.userId} ></LibraryItemCard>)
                      }
              </div>
            </div>
{/* 
            <div className="library-content-container">
              <h2>Liked Playlists</h2>
              <div className="playlist-content">
                  {likedPlaylistsClass.map(singlePlaylist =>
                      <LibraryItemCard key={singlePlaylist.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singlePlaylist} ></LibraryItemCard>)}
              </div>
            </div> */}

            </>
        )

    
    }

    export const LikedPlaylistsComponent : React.FC<LibraryComponentProps> = (props:LibraryComponentProps)=>{

      // let myPlaylists = []
      // let likedPlaylists = []
  
      const playlists : Playlist[] = fetchedPlaylistsResource.read()
      console.log("RESOURCE: ",playlists)
  
      const likedPlaylists= playlists.filter((playlistObject:Playlist)=>
          playlistObject.owner.id !== props.userId
          )
          
          // const userPlaylistsClass: Library[] = myPlaylists.map((playlistObject:Playlist)=>new Library(playlistObject))
          const likedPlaylistsClass: Library[] = likedPlaylists.map((playlistObject:Playlist)=>new Library(playlistObject))
  
  
      
          return (
              <>
              {/* <div className="library-content-container">
                <h2>My Playlists</h2>
                <div className="playlist-content">
                    {userPlaylistsClass.map(singlePlaylist =>
                        <LibraryItemCard key={singlePlaylist.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singlePlaylist} ></LibraryItemCard>)
                        }
                </div>
              </div> */}
  
              <div className="library-content-container">
                <h2 style={{margin:0}}>Liked Playlists</h2>
                <div className="playlist-content">
                    {likedPlaylistsClass.map(singlePlaylist =>
                        <LibraryItemCard key={singlePlaylist.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singlePlaylist} ownerId={""} ></LibraryItemCard>)}
                </div>
              </div>
  
              </>
          )
  
      
      }

    export const AlbumsComponent : React.FC<LibraryComponentProps> = (props:LibraryComponentProps)=>{

      const albums : Album[] = fetchedAlbumsResource.read()
      console.log("RESOURCE: ",albums)
  
      const albumClasslist =  albums.map((album:Album)=>{
        return new Library(album['album'])})
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
  
  
   
  
          
  
      
          return (
              <>
              <div className="library-content-container">
                <h2>Liked Albums</h2>
                <div className="playlist-content">
                    {albumClasslist.map(singleAlbum =>
                        <LibraryItemCard key={singleAlbum.id} onSelectedAlbum={props.onPlaylistSelection} libraryItem={singleAlbum} ownerId={""} ></LibraryItemCard>)
                        }
                </div>
              </div>
              </>
          )
  
  }
// export PlaylistsComponents