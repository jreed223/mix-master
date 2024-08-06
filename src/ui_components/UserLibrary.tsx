import { useCallback, useEffect, useState } from "react";
import PlaylistCard, { PlaylistCardProps } from "./PlaylistCard";
import React from "react";
import { Album, CategorizedPlaylist, Features, Playlist, PlaylistItem } from '../../server/types';
import PlaylistClass from "../models/playlistClass";
import TrackCard from "./TrackCard";
import SelectedPlaylistContainer from "./SelectedPlaylistArea";
import DraftPlaylistContainer from "./StagingArea";
import PlaylistMenuBar from "./PlaylistMenu";
import AlbumCard from "./AlbumCard";

// interface UserLibraryProps{
//     stagingState: String
// }

const UserLibrary:React.FC=()=>{
    const [isLoading, setLoading] = useState(true);
    const [playlistList, setPlaylistList] = useState<PlaylistClass[]|null>(null)
    const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistClass|null>(null)
    const [playlistCards, setPlaylistCards] = useState<React.JSX.Element[]|null>(null)
    const [currentTracklist, setCurrentTracklist] = useState<PlaylistItem[]>(null)
    const [hasAudioFeatures, setHasAudioFeatures] = useState<Boolean>(false)
    const [albumList, setalbumList] = useState<Album[]>(null)
    const [selectedAlbum, setSelectedAlbum] = useState<Album|null>(null)
    const [albumCards, setAlbumCards] = useState<React.JSX.Element[]|null>(null)


    const [stagedPlaylist, setStagedPlaylist] = useState<PlaylistItem[]>([])

    const[featureFilters, setFeatureFilters] = useState<Record<string, number>>({})
    const [filteredPlaylist, setFilteredPlaylist] = useState<PlaylistItem[]|null>(null)


    const [stagingState, setStagingState] = useState<String|null>(null)


        const toggleCreation = ()=>{
            setStagingState("closed")
            console.log(stagingState)
        }



        const addStagedItems =(items:PlaylistItem[])=>{
            const newStagedPlaylist = stagedPlaylist.concat(items)
            setStagedPlaylist(newStagedPlaylist)
            console.log("Added items: ",items)
            console.log("new Staged Playlist: ",newStagedPlaylist)

        }

        const removeStagedItems = (items:PlaylistItem[])=>{
            const newStagedPlaylist = stagedPlaylist.filter(stagedItem=>!items.some(removedItem => removedItem.track.id === stagedItem.track.id))
            setStagedPlaylist(newStagedPlaylist)
            console.log("Removed items: ",items)
            console.log("new Staged Playlist: ",newStagedPlaylist)
        }
 

    const hidebutton = {
        display:"none"
    }



    const filterFeatures  = useCallback(async ()=>{
        setFilteredPlaylist(null)

        if(!selectedPlaylist){
            setFilteredPlaylist(null)
            return
        }

        if(currentTracklist && currentTracklist.length>0){
            if(selectedPlaylist.audioFeaturesSet){ //checks if audiofeatures have been fetched
                setHasAudioFeatures(true)
                console.log("audio features already set")
    
                
                
            }else{
                await selectedPlaylist.setAudioFeatures() //fetches audio features
                    setHasAudioFeatures(true)
                    console.log("audio features set")

            }
        }

        

        

        
  

        let filterPlaylist = currentTracklist


        if(currentTracklist && selectedPlaylist.audioFeaturesSet){ 
            const currentFilters = Object.keys(featureFilters) 
    
                for(let feature of currentFilters){ //iterates through keys to of filter names
                    if(typeof featureFilters[feature] === "number"){

                        const featureVal = featureFilters[feature]/100 //sets value of the selected feature
                        // console.log("feature-val: ",featureVal)
                        filterPlaylist = filterPlaylist.filter(item=> { //redeclares filterplaylist using the filter function

                        return item.track?.audio_features[feature]>=featureVal-.1&&item.track?.audio_features[feature]<=featureVal+.1  //returns tracks with feature value that are in range of +/-.1 of selecetd value
                        })
                    }
                }

                setFilteredPlaylist(filterPlaylist) 
        }
        else{
            setFilteredPlaylist(null)
            console.log("no feature vals")
        }

    }, [currentTracklist, featureFilters, selectedPlaylist]);







    


    
    //** Fetches the list of playlists for the user and maps them to the Playlist Class */
    useEffect(()=>{
        if(!playlistList){
            fetch("/spotify-data/playlists")
            .then(res=>res.json())
            .then(playlists=>{

                const playlistClassList:PlaylistClass[] = playlists.map((playlistObject:Playlist)=>{
                    

                return  new PlaylistClass(playlistObject.id,
                        playlistObject.images[0],
                        playlistObject.name,
                        playlistObject.owner,
                        playlistObject.snapshot_id,
                        playlistObject.uri,
                        playlistObject.tracks.total,)
                })
                // console.log(playlistClassList)
                // console.log("playlistList set for user library")
                setPlaylistList(playlistClassList)
            })
        }

        if(!albumList){
            fetch("/spotify-data/albums")
            .then(res=>res.json())
            .then(albums=>{

                // const playlistClassList:PlaylistClass[] = playlists.map((playlistObject:Playlist)=>{
                    

                // return  new PlaylistClass(playlistObject.id,
                //         playlistObject.images[0],
                //         playlistObject.name,
                //         playlistObject.owner,
                //         playlistObject.snapshot_id,
                //         playlistObject.uri,
                //         playlistObject.tracks.total,)
                // })
                // console.log(playlistClassList)
                // console.log("playlistList set for user library")
                setalbumList(albums)
            })
        }
        setLoading(false);


        



        

    }, [albumList, playlistList])

    //**Maps the list of playlist to playlist card components */
    useEffect(()=>{
        const displayPlaylistTracks = (playlistSelection: PlaylistClass)=>{
            setStagingState("open")
            setSelectedPlaylist(playlistSelection)
            setCurrentTracklist(null)


        }

        const displayAlbumTracks = (albumSelection: Album)=>{
            setStagingState("open")
            setSelectedAlbum(albumSelection)
            setCurrentTracklist(null)
        }
        if (playlistList){
        const playlists = playlistList.map(singlePlaylist =>
            <PlaylistCard key={singlePlaylist.id} onSelectedPlaylist={displayPlaylistTracks} playlist={singlePlaylist} ></PlaylistCard>
            );
        setPlaylistCards(playlists)
        }

        if(albumList){
            const albums = albumList.map(singleAlbum=>
                <AlbumCard key={singleAlbum.album.id} onSelectedAlbum={displayAlbumTracks} album={singleAlbum} ></AlbumCard>

            )
            setAlbumCards(albums)
        }
    
    }, [albumList, playlistList])

    //**Fetches selected playlists tracks if not already fetched*/
    useEffect(()=>{
        console.log("set tracklist block",selectedPlaylist)
        if(selectedPlaylist && selectedPlaylist.tracks.length<=0){
            // console.log("setcurrent tracks block 1: ", selectedPlaylist.tracks)
            selectedPlaylist.setTracks().then(()=>{
                setCurrentTracklist(selectedPlaylist.tracks)
                // setSelectedPlaylist(selectedPlaylist)
            // console.log("current tracklist set: ", selectedPlaylist)
            }
            )
        }else if (selectedPlaylist && selectedPlaylist.tracks.length>0){
            // console.log("setcurrent tracks block 2: ", selectedPlaylist.tracks)
            setCurrentTracklist(selectedPlaylist.tracks)
        }else{
            // console.log("setcurrent tracks block 3")

        }
    }, [selectedPlaylist])


    //** FIlters the selected playlist if the audio featrues have been set*/
    useEffect(()=>{
        // if(!selectedPlaylist){
        //     setFilteredPlaylist(null)
        // }
        let isFeatureFilterSelected = Object.values(featureFilters).some(featureVal=>typeof featureVal === "number")

        if(selectedPlaylist && isFeatureFilterSelected){
            // console.log(featureFilters.at(-1))
            console.log("useEffect run for filtFeatures")
            filterFeatures()
        }else{
            setFilteredPlaylist(currentTracklist)
        }
    }, [currentTracklist, featureFilters, filterFeatures, hasAudioFeatures, selectedPlaylist])




    if(playlistList){
        

        if(stagingState===null){
            
            return (
                <div className="main-content-area">
                    <div className="playlist-creation-container-hidden" id="creation-container">
                        <div className="playlist-creation-menu-bar">
                            <button onClick={()=>setStagingState("closed")} style={hidebutton}></button>

                        </div>
                        <div className="playlist-items-containers">

                            <SelectedPlaylistContainer onSelectedItems={addStagedItems} playlist={selectedPlaylist} stagedPlaylistItems={stagedPlaylist} filteredTracks={filteredPlaylist}></SelectedPlaylistContainer>
                            {/* <div className="search-filter-container new-playlist" id="search-filter-div"></div> */}
                            <DraftPlaylistContainer onSelectedItems={removeStagedItems} selectedTracks={stagedPlaylist}></DraftPlaylistContainer>
                            {/* <div className="playlist-draft-container new-playlist" id="drafting-div"></div> */}
                        </div>
                    </div >
                    <div className="library-container" id="library-container">
                    <p className="library-heading">Library</p>
                    <div className='library-content'>
                        <div className="playlist-content">{playlistCards}</div>
                        <div className="album-content">{albumCards}</div>
                    </div>
                    </div>
                </div>)
            }else if(stagingState==="open"){
                
        
                
                return (
                    <div className="main-content-area">
                        
                            <div className="playlist-creation-container-new grow-staging" id="creation-container">
                            <PlaylistMenuBar onExit={setStagingState} selectedPlaylist={selectedPlaylist}  currentTracks={currentTracklist} onFilterSet={setFeatureFilters}></PlaylistMenuBar>


                                <div className="playlist-items-containers">
                                    <SelectedPlaylistContainer onSelectedItems={addStagedItems} playlist={selectedPlaylist} stagedPlaylistItems={stagedPlaylist}  filteredTracks={filteredPlaylist}></SelectedPlaylistContainer>

                                    <DraftPlaylistContainer onSelectedItems={removeStagedItems} selectedTracks={stagedPlaylist}></DraftPlaylistContainer>

                                    {/* <div className="playlist-draft-container new-playlist" id="drafting-div"></div> */}
                                </div >
                            </div>
                        
                            <div className="library-container-new shrink-library" id="library-container">
                                <p className="library-heading">Library</p>
                                <div className='library-content'>
                                    <div className="playlist-content">{playlistCards}</div>
                                    <div className="album-content">{albumCards}</div>
                                </div>
                            </div>
                    </div>)
                // }
            }else if(stagingState==="closed"){
  
                return (
                    <div className="main-content-area">
                        
                            <div className="playlist-creation-container-hidden shrink-staging" id="creation-container">
                                <div className="playlist-creation-menu-bar">
                                    <button onClick={toggleCreation} style={hidebutton}></button>
                                </div>
                                <div className="playlist-items-containers">
                                    <SelectedPlaylistContainer onSelectedItems={addStagedItems} playlist={selectedPlaylist} stagedPlaylistItems={stagedPlaylist}  filteredTracks={filteredPlaylist}></SelectedPlaylistContainer>

                                    <DraftPlaylistContainer onSelectedItems={removeStagedItems} selectedTracks={stagedPlaylist}></DraftPlaylistContainer>
                                    {/* <div className="playlist-draft-container new-playlist" id="drafting-div"></div> */}
                                </div >
                            </div>
                        
                            <div className="library-container grow-library" id="library-container">
                                <p className="library-heading">Library</p>
                                <div className='library-content'>
                                    <div className="playlist-content">{playlistCards}</div>
                                    <div className="album-content">{albumCards}</div>
                                </div>
                            </div>
                    </div>)
                // }
            }else if(stagingState==="closed"){
                
                return (
                    <div className="main-content-area">
                        <div className="playlist-creation-container-hidden shrink-staging" id="creation-container">
                            <div className="playlist-creation-menu-bar">
                                <button onClick={toggleCreation} style={hidebutton}></button>
                            </div>
                            <div className="playlist-items-containers">

                                <SelectedPlaylistContainer onSelectedItems={addStagedItems} playlist={selectedPlaylist} stagedPlaylistItems={stagedPlaylist} filteredTracks={filteredPlaylist}></SelectedPlaylistContainer>


                                <DraftPlaylistContainer onSelectedItems={removeStagedItems} selectedTracks={stagedPlaylist}></DraftPlaylistContainer>

                                {/* <div className="playlist-draft-container new-playlist" id="drafting-div"></div> */}
                            </div>
                        </div >
                        
                            <div className="library-container grow-library" id="library-container">
                                <p className="library-heading">Library</p>
                                <div className='library-content'>
                                    <div className="playlist-content">{playlistCards}</div>
                                    <div className="album-content">{albumCards}</div>
                                </div>
                            </div>
                    </div>)
            // }
        }
    }else if(isLoading){

        return<p>Loading...</p>
    }else{
        return<p>No playlists found. Plese try again.</p>
    }

}

export default UserLibrary