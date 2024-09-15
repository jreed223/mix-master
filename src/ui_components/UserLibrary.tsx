import { Suspense, useCallback, useEffect, useRef, useState } from "react";
// import PlaylistCard, { PlaylistCardProps } from "./PlaylistCard";
import React from "react";
import { Album, Playlist, Track, UserProfile } from '../../server/types';
import SelectedPlaylistContainer from "./SelectedPlaylistArea";
import DraftPlaylistContainer from "./StagingArea";
import PlaylistMenuBar from "./PlaylistMenu";
import AlbumCard from "./AlbumCard";
import Library from "../models/libraryItems";
import CircularProgress from '@mui/material/CircularProgress';



interface UserLibraryProps{
    currentUser: UserProfile
}

export default function UserLibrary(props:UserLibraryProps){

    const [myPlaylistList, setMyPlaylistList] = useState<Library[]|null>(null)
    const [likedPlaylistList, setLikedPlaylistList] = useState<Library[]|null>(null)
    const [albumList, setalbumList] = useState<Library[]>(null)
    
    const [selectedLibraryItem, setSelectedLibraryItem] = useState<Library|null>(null)

    const [stagedPlaylist, setStagedPlaylist] = useState<Track[]>([])
    const [stagedPlaylistState, setStagedPlaylistState] = useState<Track[][]>([[]])

    const[featureFilters, setFeatureFilters] = useState<Record<string, number>>({})


    const [stagingState, setStagingState] = useState<String|null>(null)

        // const undoStagedItems = ()=>{
        //     console.log("stagedPlaylist at -1",stagedPlaylistState.at(-1))

        //     setStagedPlaylistState(stagedPlaylistState.slice(0, -1))
        //     setStagedPlaylist(stagedPlaylistState.at(-2))
        // }
        const closeCreationContainer = useCallback(()=>{
            setStagingState("closed")
            console.log(stagingState)
            creationContainer.current.classList = "playlist-creation-container-hidden shrink-staging"
            libraryContainer.current.classList = "library-container grow-library"

        }, [stagingState])



        const addStagedItems =(items:Track[])=>{
            const newStagedPlaylist = stagedPlaylist.concat(items)
            setStagedPlaylist(newStagedPlaylist)
            setStagedPlaylistState(stagedPlaylistState.concat([newStagedPlaylist]))
            console.log("Added items: ",items)
            console.log("new Staged Playlist: ",newStagedPlaylist)
            console.log(stagedPlaylistState)


        }

        const removeStagedItems = (items:Track[])=>{
            const newStagedPlaylist = stagedPlaylist.filter(stagedItem=>!items.some(removedItem => removedItem.id === stagedItem.id))
            setStagedPlaylist(newStagedPlaylist)
            setStagedPlaylistState(stagedPlaylistState.concat([newStagedPlaylist]))
            console.log("Removed items: ",items)
            console.log("new Staged Playlist: ",newStagedPlaylist)
            console.log(stagedPlaylistState)

        }
 
        const getNextTracks = ()=>{
            selectedLibraryItem.getNextTracks()
        }    


    
    //** Fetches the list of playlists for the user and maps them to the Playlist Class */
    useEffect(()=>{
            fetch("/spotify-data/playlists")
            .then(res=>res.json())
            .then(playlists=>{
                let myPlaylists = []
                let likedPlaylists = []

                playlists.map((playlistObject:Playlist)=>{
                    return playlistObject.owner.id === props.currentUser.id? 
                        myPlaylists.push(playlistObject):
                        likedPlaylists.push(playlistObject)

                                    })
                    const myPlaylistsClass: Library[] = myPlaylists.map((playlistObject:Playlist)=>{


                        return  new Library(playlistObject)
                    })
                    const LikedPlaylistsClass: Library[] = likedPlaylists.map((playlistObject:Playlist)=>{


                        return  new Library(playlistObject)
                    })

                    setMyPlaylistList(myPlaylistsClass)
                    setLikedPlaylistList(LikedPlaylistsClass)

            })

            fetch("/spotify-data/albums")
            .then(res=>res.json())
            .then(albums=>{


                const albumClasslist =  albums.map((album:Album)=>{
                    return new Library(album['album'])})
                setalbumList(albumClasslist)
            })
  







    }, [props.currentUser.id])





    const creationContainer = useRef(null)
    const libraryContainer = useRef(null)


    const displayTracks = (albumSelection: Library)=>{
        setStagingState("open")
        setSelectedLibraryItem(albumSelection)

        creationContainer.current.classList = "playlist-creation-container-new grow-staging"
        libraryContainer.current.classList = ('library-container-new shrink-library')
    }




        return (
            <div className="main-content-area">

                    <div ref={creationContainer} className="playlist-creation-container-hidden" id="creation-container">
                    <PlaylistMenuBar onExit={closeCreationContainer} onFilterSet={setFeatureFilters}></PlaylistMenuBar>

                        <div className="playlist-items-containers">
                            <SelectedPlaylistContainer onSelectedItems={addStagedItems} libraryItem={selectedLibraryItem} stagedPlaylistItems={stagedPlaylist} onGetNextItems={getNextTracks} featureFilters={featureFilters}></SelectedPlaylistContainer>

                            <DraftPlaylistContainer stagedItemsState={stagedPlaylistState} onUndostaging={setStagedPlaylist} onSelectedItems={removeStagedItems} stagedTracks={stagedPlaylist}></DraftPlaylistContainer>
                        </div >
                    </div>

                    <div ref={libraryContainer} className="library-container" id="library-container">
                        <p className="library-heading">Library</p>
                        {/* {myPlaylistList&&likedPlaylistList&&albumList? */}

                            <div className='library-content'>

                                <p>My Playlists</p>
                                <div className="playlist-content">
                                    {/* <Suspense fallback={<CircularProgress/>}>
                                    {
                                    myPlaylistList.map(singlePlaylist =>
                                    <AlbumCard key={singlePlaylist.id} onSelectedAlbum={displayTracks} libraryItem={singlePlaylist} ></AlbumCard>
                                    )}
                                    </Suspense> */}
                                    {myPlaylistList?myPlaylistList.map(singlePlaylist =>
                                    <AlbumCard key={singlePlaylist.id} onSelectedAlbum={displayTracks} libraryItem={singlePlaylist} ></AlbumCard>
                                    ):<p>LOADING MY PLAYLISTS...</p>}
                                </div>

                                <p>Liked Playlists</p>
                                <div className="playlist-content">
                                    {likedPlaylistList?likedPlaylistList.map(singlePlaylist =>
                                    <AlbumCard key={singlePlaylist.id} onSelectedAlbum={displayTracks} libraryItem={singlePlaylist} ></AlbumCard>
                                    ):<CircularProgress/>}
                                </div>

                                <p>Albums</p>
                                <div className="album-content">
                                    {albumList?albumList.map(singleAlbum=>
                                    <AlbumCard key={singleAlbum.id} onSelectedAlbum={displayTracks} libraryItem={singleAlbum} ></AlbumCard>
                                ):<p>LOADING ALBUMS...</p>}
                                </div>
                            </div>
                            {/* // : */}
                            {/* // <div className="library-content">Loading User Library...</div> } */}

                    </div>
            </div>)


                        }
