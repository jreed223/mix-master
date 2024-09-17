import { Suspense, useCallback, useEffect, useRef, useState } from "react";
// import PlaylistCard, { PlaylistCardProps } from "./PlaylistCard";
import React from "react";
import { Album, Playlist, Track, UserProfile } from '../../server/types';
import SelectedPlaylistContainer from "./SelectedPlaylistArea";
import DraftPlaylistContainer from "./StagingArea";
import PlaylistMenuBar from "./PlaylistMenu";
import AlbumCard from "./LibraryItemCard";
import Library from "../models/libraryItems";
import CircularProgress from '@mui/material/CircularProgress';
import { AlbumsComponent, LikedPlaylistsComponent, UserPlaylistsComponent } from "./LibraryComponents";



interface UserLibraryProps{
    currentUser: UserProfile
}

export default function UserLibrary(props:UserLibraryProps){
    
    const [selectedLibraryItem, setSelectedLibraryItem] = useState<Library|null>(null)

    const [stagedPlaylist, setStagedPlaylist] = useState<Track[]>([])
    const [stagedPlaylistState, setStagedPlaylistState] = useState<Track[][]>([[]])

    const[featureFilters, setFeatureFilters] = useState<Record<string, number>>({})


    const [stagingState, setStagingState] = useState<String|null>(null)

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

    const creationContainer = useRef(null)
    const libraryContainer = useRef(null)


    const displayTracks = (selection: Library)=>{
        setStagingState("open")
        if(selection.id !== selectedLibraryItem?.id){
            setSelectedLibraryItem(selection)
        }
        // setSelectedLibraryItem(selection)

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
                            {/* <div className='library-content'> */}
                            <div className="user-library-items">
                            <Suspense fallback={<CircularProgress/>}>
                                <UserPlaylistsComponent userId={props.currentUser.id} onPlaylistSelection={displayTracks}></UserPlaylistsComponent>
                            </Suspense>
                            </div>
                            <div className="liked-library-items">
                            <Suspense fallback={<CircularProgress/>}>
                                <LikedPlaylistsComponent userId={props.currentUser.id} onPlaylistSelection={displayTracks}></LikedPlaylistsComponent>
                            </Suspense>
                            <Suspense fallback={<CircularProgress/>}>
                                <AlbumsComponent userId={props.currentUser.id} onPlaylistSelection={displayTracks}></AlbumsComponent>
                            </Suspense>
                            </div>
                            
                            {/* <div className="liked-library-components">
                            <Suspense fallback={<CircularProgress/>}>
                                <LikedPlaylistsComponent userId={props.currentUser.id} onPlaylistSelection={displayTracks}></LikedPlaylistsComponent>
                            </Suspense>
                            <Suspense fallback={<CircularProgress/>}>
                                <AlbumsComponent userId={props.currentUser.id} onPlaylistSelection={displayTracks}></AlbumsComponent>
                            </Suspense>
                            </div> */}

                            {/* </div> */}
                    </div>
            </div>)


                        }
