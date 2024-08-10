import { useCallback, useEffect, useRef, useState } from "react";
// import PlaylistCard, { PlaylistCardProps } from "./PlaylistCard";
import React from "react";
import { Album, CategorizedPlaylist, Features, Playlist, PlaylistItem, Track, UserProfile } from '../../server/types';
import PlaylistClass from "../models/playlistClass";
import TrackCard from "./TrackCard";
import SelectedPlaylistContainer from "./SelectedPlaylistArea";
import DraftPlaylistContainer from "./StagingArea";
import PlaylistMenuBar from "./PlaylistMenu";
import AlbumCard from "./AlbumCard";
import Library, { LibraryItem } from "../models/libraryItems";

// interface UserLibraryProps{
//     stagingState: String
// }
interface UserLibraryProps{
    currentUser: UserProfile
}

export default function UserLibrary(props:UserLibraryProps){
    const [isLoading, setLoading] = useState(true);

    const [myPlaylistList, setMyPlaylistList] = useState<Library[]|null>(null)
    const [likedPlaylistList, setLikedPlaylistList] = useState<Library[]|null>(null)
    const [albumList, setalbumList] = useState<Library[]>(null)
    
    const [selectedLibraryItem, setSelectedLibraryItem] = useState<Library|null>(null)
    const [currentTracks, setCurrentTracks] = useState<Track[]>(null)

    const [stagedPlaylist, setStagedPlaylist] = useState<Track[]>([])

    const[featureFilters, setFeatureFilters] = useState<Record<string, number>>({})
    const [filteredTracks, setFilteredTracks] = useState<Track[]|null>(null)


    const [stagingState, setStagingState] = useState<String|null>(null)


        const closeCreationContainer = useCallback(()=>{
            setStagingState("closed")
            console.log(stagingState)
            creationContainer.current.classList = "playlist-creation-container-hidden shrink-staging"
            // creationContainer.current.removeChild(creationContainer.current.firstChild)
            libraryContainer.current.classList = "library-container grow-library"

        }, [stagingState])



        const addStagedItems =(items:Track[])=>{
            const newStagedPlaylist = stagedPlaylist.concat(items)
            setStagedPlaylist(newStagedPlaylist)
            console.log("Added items: ",items)
            console.log("new Staged Playlist: ",newStagedPlaylist)

        }

        const removeStagedItems = (items:Track[])=>{
            const newStagedPlaylist = stagedPlaylist.filter(stagedItem=>!items.some(removedItem => removedItem.id === stagedItem.id))
            setStagedPlaylist(newStagedPlaylist)
            console.log("Removed items: ",items)
            console.log("new Staged Playlist: ",newStagedPlaylist)
        }
 

    const hidebutton = {
        display:"none"
    }



    const filterFeatures  = useCallback(async ()=>{
        setFilteredTracks(null)

        if(!selectedLibraryItem){
            setFilteredTracks(null)
            return
        }

        if(currentTracks && currentTracks.length>0){
            if(selectedLibraryItem.audioFeaturesSet){ //checks if audiofeatures have been fetched
                // setHasAudioFeatures(true)
                console.log("audio features already set")
    
                
                
            }else{
                await selectedLibraryItem.setAudioFeatures() //fetches audio features
                    // setHasAudioFeatures(true)
                    console.log("audio features set")

            }
        }

        

        

        
  

        let filterPlaylist = currentTracks


        if(currentTracks && selectedLibraryItem.audioFeaturesSet){ 
            const currentFilters = Object.keys(featureFilters) 
    
                for(let feature of currentFilters){ //iterates through keys to of filter names
                    if(typeof featureFilters[feature] === "number"){

                        const featureVal = featureFilters[feature]/100 //sets value of the selected feature
                        // console.log("feature-val: ",featureVal)
                        filterPlaylist = filterPlaylist.filter(item=> { //redeclares filterplaylist using the filter function

                        return item.audio_features[feature]>=featureVal-.1&&item.audio_features[feature]<=featureVal+.1  //returns tracks with feature value that are in range of +/-.1 of selecetd value
                        })
                    }
                }

                setFilteredTracks(filterPlaylist) 
        }
        else{
            setFilteredTracks(null)
            console.log("no feature vals")
        }

    }, [currentTracks, featureFilters, selectedLibraryItem]);







    


    
    //** Fetches the list of playlists for the user and maps them to the Playlist Class */
    useEffect(()=>{
        // if(!playlistList){
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
        // }

        // if(!albumList){
            fetch("/spotify-data/albums")
            .then(res=>res.json())
            .then(albums=>{

  
                const albumClasslist =  albums.map((album:Album)=>{
                    console.log("album in album list: ",album.album)
                    return new Library(album['album'])})
                setalbumList(albumClasslist)
            })
        // }
        setLoading(false);


        



        

    }, [props.currentUser.id])

    //**Maps the list of playlist to playlist card components */
    // useEffect(()=>{


    //     const displayTracks = (albumSelection: Library)=>{
    //         setStagingState("open")
    //         setSelectedLibraryItem(albumSelection)

    //         creationContainer.current.classList = "playlist-creation-container-new grow-staging"
    //         libraryContainer.current.classList = ('library-container-new shrink-library')
    //     }
        

    //     if(myPlaylistList){
    //         const myPlaylists = myPlaylistList.map(singlePlaylist =>
    //         <AlbumCard key={singlePlaylist.id} onSelectedAlbum={displayTracks} libraryItem={singlePlaylist} ></AlbumCard>
    //         );
    //     setMyPlaylistCards(myPlaylists)
    //     }

    //     if(likedPlaylistList){
    //         const LikedPlaylists = likedPlaylistList.map(singlePlaylist =>
    //         <AlbumCard key={singlePlaylist.id} onSelectedAlbum={displayTracks} libraryItem={singlePlaylist} ></AlbumCard>
    //         );
    //     setLikedPlaylistCards(LikedPlaylists)
    //     }
        

    //     if(albumList){
    //         const albums = albumList.map(singleAlbum=>
    //             <AlbumCard key={singleAlbum.id} onSelectedAlbum={displayTracks} libraryItem={singleAlbum} ></AlbumCard>

    //         )
    //         setAlbumCards(albums)
    //     }
    
    // }, [albumList, closeCreationContainer, likedPlaylistList, myPlaylistList])

    //**Fetches selected playlists tracks if not already fetched*/
    useEffect(()=>{


        // console.log("set tracklist block",selectedPlaylist)
        if(selectedLibraryItem && !selectedLibraryItem?.tracks){
            // console.log("setcurrent tracks block 1: ", selectedPlaylist.tracks)
            selectedLibraryItem.setTracks().then(()=>{
                setCurrentTracks(selectedLibraryItem.tracks)
                // setSelectedPlaylist(selectedPlaylist)
            // console.log("current tracklist set: ", selectedPlaylist)
            }
            )
        }else if (selectedLibraryItem && selectedLibraryItem?.tracks){
            // console.log("setcurrent tracks block 2: ", selectedPlaylist.tracks)
            setCurrentTracks(selectedLibraryItem.tracks)
        }else{
            // console.log("setcurrent tracks block 3")

        }
    }, [selectedLibraryItem])


    //** FIlters the selected playlist if the audio featrues have been set*/
    useEffect(()=>{


        let isFeatureFilterSelected = Object.values(featureFilters).some(featureVal=>typeof featureVal === "number")

        if(selectedLibraryItem && isFeatureFilterSelected){
            // console.log(featureFilters.at(-1))
            console.log("useEffect run for filtFeatures")
            filterFeatures()
        }else{
            setFilteredTracks(currentTracks)
        }
    }, [ currentTracks, featureFilters, filterFeatures, selectedLibraryItem])

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
                    {stagingState==="open"?
                    <PlaylistMenuBar onExit={closeCreationContainer} onFilterSet={setFeatureFilters}></PlaylistMenuBar>
                    :<div className="playlist-creation-menu-bar">
                        <button  style={hidebutton}></button>
                    
                    </div>
                    }

                        <div className="playlist-items-containers">
                            <SelectedPlaylistContainer onSelectedItems={addStagedItems} libraryItem={selectedLibraryItem} stagedPlaylistItems={stagedPlaylist}  filteredTracks={filteredTracks}></SelectedPlaylistContainer>

                            <DraftPlaylistContainer onSelectedItems={removeStagedItems} selectedTracks={stagedPlaylist}></DraftPlaylistContainer>
                        </div >
                    </div>
                
                    <div ref={libraryContainer} className="library-container" id="library-container">
                        <p className="library-heading">Library</p>
                        {myPlaylistList&&likedPlaylistList&&albumList?
                        
                            <div className='library-content'>

                                <p>My Playlists</p>
                                <div className="playlist-content">{myPlaylistList.map(singlePlaylist =>
                                    <AlbumCard key={singlePlaylist.id} onSelectedAlbum={displayTracks} libraryItem={singlePlaylist} ></AlbumCard>
                                    )}
                                </div>
                                    
                                <p>Liked Playlists</p>
                                <div className="playlist-content">{likedPlaylistList.map(singlePlaylist =>
                                    <AlbumCard key={singlePlaylist.id} onSelectedAlbum={displayTracks} libraryItem={singlePlaylist} ></AlbumCard>
                                    )}
                                </div>
            
                                <p>Albums</p>
                                <div className="album-content">{albumList.map(singleAlbum=>
                                    <AlbumCard key={singleAlbum.id} onSelectedAlbum={displayTracks} libraryItem={singleAlbum} ></AlbumCard>
                                )}
                                </div>
                            </div>
                            :
                            <div className="library-content">Loading User Library...</div> }
                  
                    </div>
            </div>)


                        }
   