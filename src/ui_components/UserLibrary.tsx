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
    activeView: string[]
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
    const userItemsContainer = useRef(null)
    const likedItemsContainer = useRef(null)


    const displayTracks = (selection: Library)=>{
        setStagingState("open")
        if(selection.id !== selectedLibraryItem?.id){
            setSelectedLibraryItem(selection)
        }
        // setSelectedLibraryItem(selection)

        creationContainer.current.classList = "playlist-creation-container-new grow-staging"
        libraryContainer.current.classList = ('library-container-new shrink-library')
    }

    // let active = {
    //     width: "100%",
    //     animation: "grow-columns 1s",
    //     transition: "1s"



    // }

    // let inactive = {
    //     width: "0%",
    //     animation: "shrink-columns 1s",
    //     transition: "1s"


    // }
    // let inactive1;
    // let active1;

    // if(props.activeView.at(0)==="dashboard"){
        
    //     inactive = {
    //             width: "0%",
    //             animation: "shrink-from-default 1s",
    //             transition: "1s"
    //     }

    //     active = {
    //         width: "100%",
    //         animation: "grow-from-default 1s",
    //         transition: "1s"


    //     }

    // }

//     const shrinkToDefault = {
//         width: "0%",
//         animation: "shrink-to-default 1s",
//         transition: "1s"
// }

// const growToDefault = {
//     width: "100%",
//     animation: "grow-to-default 1s",
//     transition: "1s"


// }

// let userPlaylistStyles ;
// let likedPlaylistsStyle;

const [userPlaylistsStyle, setUserPlaylistsStyle] = useState({})
const [likedPlaylistsStyle, setLikedPlaylistsStyle] = useState({})
useEffect(()=>{

    const shrinkToDefault = {
        width: "50%",
        animation: "shrink-to-default 1s",
        transition: "1s"
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
        transition: "1s",
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
    
    if(props.activeView.at(-1)==="dashboard" ){
        

        if(props.activeView.at(-2)!=="user playlists"){
            setUserPlaylistsStyle(growToDefault)
            setLikedPlaylistsStyle(shrinkToDefault)
        }else{
            setUserPlaylistsStyle(shrinkToDefault)
            setLikedPlaylistsStyle(growToDefault)

        }

    }else if(props.activeView.at(-2)==="dashboard" ){


        if(props.activeView.at(-1)!=="user playlists"){
            setUserPlaylistsStyle(shrinkFromDeafault)
            setLikedPlaylistsStyle(growFromDefault)

        }else{
            setUserPlaylistsStyle(growFromDefault)
            setLikedPlaylistsStyle(shrinkFromDeafault)

        }

    }
    else{

        switch(props.activeView.at(-1)){
            case "user playlists":
                if(props.activeView.at(-2)==="liked playlists"||"liked albums"){
                    setLikedPlaylistsStyle(inactive)
                    setUserPlaylistsStyle(active)
                }
                break;
            case "liked playlists":
                if(props.activeView.at(-2)==="liked albums"){

                }else{
                    setLikedPlaylistsStyle(active)
                    setUserPlaylistsStyle(inactive)
                }
                break;
            case "liked albums":
                if(props.activeView.at(-2)==="liked playlists"){

                }else{
                    setLikedPlaylistsStyle(active)
                    setUserPlaylistsStyle(inactive)
                }
                break;
        
        }


        // console.log(`activeView : ${props.activeView}, userPlaylistStyles : ${JSON.stringify(userPlaylistStyles)}, likedPlaylistsStyle : ${JSON.stringify(likedPlaylistsStyle)}`)

    }
}, [props.activeView])



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
                            
                            <div ref={userItemsContainer} className="user-library-items" style={userPlaylistsStyle}>
                            <Suspense fallback={<CircularProgress/>}>
                                <UserPlaylistsComponent stagingState={stagingState}activeView={props.activeView} userId={props.currentUser.id} onPlaylistSelection={displayTracks} selectedLibraryItemId={selectedLibraryItem?.id}></UserPlaylistsComponent>
                            </Suspense>
                            </div>
                            <div ref={likedItemsContainer} className="liked-library-items" style={likedPlaylistsStyle}>
                            <Suspense fallback={<CircularProgress/>}>
                                <LikedPlaylistsComponent stagingState={stagingState} activeView={props.activeView} userId={props.currentUser.id} onPlaylistSelection={displayTracks} selectedLibraryItemId={selectedLibraryItem?.id}></LikedPlaylistsComponent>
                            </Suspense>
                            <Suspense fallback={<CircularProgress/>}>
                                <AlbumsComponent stagingState={stagingState} activeView={props.activeView} userId={props.currentUser.id} onPlaylistSelection={displayTracks} selectedLibraryItemId={selectedLibraryItem?.id}></AlbumsComponent>
                            </Suspense>
                            </div>

                    </div>
            </div>)


                        }
