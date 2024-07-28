import { useEffect, useState } from "react";
import PlaylistCard, { PlaylistCardProps } from "./PlaylistCard";
import React from "react";
import { CategorizedPlaylist, Features, Playlist, PlaylistItem } from '../../server/types';
import PlaylistClass from "../models/playlistClass";
import TrackCard from "./TrackCard";
import SelectedPlaylistContainer from "./SelectedPlaylistArea";
import DraftPlaylistContainer from "./StagingArea";
import PlaylistMenuBar from "./PlaylistMenu";

// interface UserLibraryProps{
//     stagingState: String
// }

const UserLibrary:React.FC=()=>{
    const [isLoading, setLoading] = useState(true);
    const [playlistList, setPlaylistList] = useState<PlaylistClass[]|null>(null)
    const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistClass|null>(null)
    const [playlistCards, setPlaylistCards] = useState<React.JSX.Element[]|null>(null)
    const [stagedPlaylist, setStagedPlaylist] = useState<PlaylistItem[]>([])
    const[featureFilter, setFeatureFilter] = useState<Features[]>([])


    // const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState<PlaylistClass[`tracks`]|null>(null)

    const [stagingState, setStagingState] = useState<String|null>(null)


        const toggleCreation = ()=>{
            setStagingState("closed")
            console.log(stagingState)
        }

        const setFeatureFilterState = (featureList:Features[])=>{
            
            setFeatureFilter(featureList)
            console.log("new features set for filter")
        }

        // const editSelectedItemList = (e: React.ChangeEvent<HTMLInputElement>,selectedItem: PlaylistItem)=>{
        //     if(e.target.checked){
        //         setSelectedPlaylistItems(selectedPlaylistItems.concat([selectedItem]))
        
        //     }else{
        //         setSelectedPlaylistItems(selectedPlaylistItems.filter(item=>item!== selectedItem))
        //     }
        //     console.log(selectedPlaylistItems)
        // }

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

    const shrinkmenu = {
        height: 0,
    }

    useEffect(()=>{
        const displayTracks = (playlistSelection: PlaylistClass)=>{
            setStagingState("open")
            setSelectedPlaylist(playlistSelection)

        }
        if (playlistList){
        const playlists = playlistList.map(singlePlaylist =>
            <PlaylistCard key={singlePlaylist.id} onSelectedPlaylist={displayTracks} playlist={singlePlaylist} ></PlaylistCard>
            );
        setPlaylistCards(playlists)
        }
       
    }, [playlistList])

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
            console.log("playlistList set for user library")
            setPlaylistList(playlistClassList)
            setLoading(false);
        })
    }


    if(playlistList){
        

        if(stagingState===null){
            
            return (
                <div className="main-content-area">
                    <div className="playlist-creation-container-hidden" id="creation-container">
                        <div className="playlist-creation-menu-bar">
                            <button onClick={()=>setStagingState("closed")} style={hidebutton}></button>

                        </div>
                        <div className="playlist-items-containers">

                            <SelectedPlaylistContainer onSelectedItems={addStagedItems} playlist={selectedPlaylist} stagedPlaylistItems={stagedPlaylist} audioFeatureFilters={featureFilter}></SelectedPlaylistContainer>
                            {/* <div className="search-filter-container new-playlist" id="search-filter-div"></div> */}
                            <DraftPlaylistContainer onSelectedItems={removeStagedItems} selectedTracks={stagedPlaylist}></DraftPlaylistContainer>
                            {/* <div className="playlist-draft-container new-playlist" id="drafting-div"></div> */}
                        </div>
                    </div >
                    <div className="library-container" id="library-container">
                    <p className="library-heading">Library</p>
                    <div className='library-content'>
                        <div className="playlist-content">{playlistCards}</div>
                        <div className="album-content">{playlistCards}</div>
                    </div>
                    </div>
                </div>)
            }else if(stagingState==="open"){
                // if(selectedPlaylistTracks){
                //     const tracks = selectedPlaylistTracks.map(singleTrack=>
                //         <TrackCard playlistItem={singleTrack}></TrackCard>
                //     )
        
                
                return (
                    <div className="main-content-area">
                        
                            <div className="playlist-creation-container-new grow-staging" id="creation-container">
                            <PlaylistMenuBar onExit={setStagingState} onFilteredItems={setFeatureFilterState }></PlaylistMenuBar>

                                {/* <div className="playlist-creation-menu-bar">
                                    <button onClick={()=>setStagingState("closed")}>Close</button>
                                    <button>Audio Features</button> */}

{/* <select name="cars" id="cars"> */}
{/* <option value="volvo"> */}
{/* <div>
<div>  <label>feature 1</label><input type="checkbox"/><input type="range" min="1" max="100" value="50" className="slider" />
</div>
<div>  <label>feature 1</label><input type="checkbox"/><input type="range" min="1" max="100" value="50" className="slider" />
</div>
<div>  <label>feature 1</label><input type="checkbox"/><input type="range" min="1" max="100" value="50" className="slider"/>
</div>
<div>  <label>feature 1</label><input type="checkbox"/><input type="range" min="1" max="100" value="50" className="slider"/>
</div>
</div> */}

{/* <input type="range" min="1" max="100" value="50"  id="myRange"></input> */}
{/* </option> */}

{/* </select> */}
                                {/* </div> */}
                                <div className="playlist-items-containers">
                                    <SelectedPlaylistContainer onSelectedItems={addStagedItems} playlist={selectedPlaylist} stagedPlaylistItems={stagedPlaylist} audioFeatureFilters={featureFilter}></SelectedPlaylistContainer>

                                    {/* <div className="search-filter-container new-playlist" id="search-filter-div" >
                                        <button onClick={toggleCreation}></button>
                                        {tracks}
                                    </div> */}
                                    <DraftPlaylistContainer onSelectedItems={removeStagedItems} selectedTracks={stagedPlaylist}></DraftPlaylistContainer>

                                    {/* <div className="playlist-draft-container new-playlist" id="drafting-div"></div> */}
                                </div >
                            </div>
                        
                            <div className="library-container-new shrink-library" id="library-container">
                                <p className="library-heading">Library</p>
                                <div className='library-content'>
                                    <div className="playlist-content">{playlistCards}</div>
                                    <div className="album-content">{playlistCards}</div>
                                </div>
                            </div>
                    </div>)
                // }
            }else if(stagingState==="closed"){
                // if(selectedPlaylistTracks){
                //     const tracks = selectedPlaylistTracks.map(singleTrack=>
                //         <TrackCard playlistItem={singleTrack}></TrackCard>
                //     )
                return (
                    <div className="main-content-area">
                        
                            <div className="playlist-creation-container-hidden shrink-staging" id="creation-container">
                                <div className="playlist-creation-menu-bar">
                                    <button onClick={toggleCreation} style={hidebutton}></button>
                                </div>
                                <div className="playlist-items-containers">
                                    <SelectedPlaylistContainer onSelectedItems={addStagedItems} playlist={selectedPlaylist} stagedPlaylistItems={stagedPlaylist} audioFeatureFilters={featureFilter}></SelectedPlaylistContainer>

                                    {/* <div className="search-filter-container new-playlist" id="search-filter-div" >
                                        <button onClick={toggleCreation}></button>
                                        {tracks}
                                    </div> */}
                                    <DraftPlaylistContainer onSelectedItems={removeStagedItems} selectedTracks={stagedPlaylist}></DraftPlaylistContainer>
                                    {/* <div className="playlist-draft-container new-playlist" id="drafting-div"></div> */}
                                </div >
                            </div>
                        
                            <div className="library-container grow-library" id="library-container">
                                <p className="library-heading">Library</p>
                                <div className='library-content'>
                                    <div className="playlist-content">{playlistCards}</div>
                                    <div className="album-content">{playlistCards}</div>
                                </div>
                            </div>
                    </div>)
                // }
            }else if(stagingState==="closed"){
                // if(selectedPlaylistTracks){
                //     const tracks = selectedPlaylistTracks.map(singleTrack=>
                //         <TrackCard playlistItem={singleTrack}></TrackCard>
                //     )
                return (
                    <div className="main-content-area">
                        <div className="playlist-creation-container-hidden shrink-staging" id="creation-container">
                            <div className="playlist-creation-menu-bar">
                                <button onClick={toggleCreation} style={hidebutton}></button>
                            </div>
                            <div className="playlist-items-containers">

                                <SelectedPlaylistContainer onSelectedItems={addStagedItems} playlist={selectedPlaylist} stagedPlaylistItems={stagedPlaylist} audioFeatureFilters={featureFilter}></SelectedPlaylistContainer>

                                {/* <div className="search-filter-container new-playlist" id="search-filter-div" >
                                    <button onClick={toggleCreation}></button>
                                    {tracks}
                                </div> */}
                                <DraftPlaylistContainer onSelectedItems={removeStagedItems} selectedTracks={stagedPlaylist}></DraftPlaylistContainer>

                                {/* <div className="playlist-draft-container new-playlist" id="drafting-div"></div> */}
                            </div>
                        </div >
                        
                            <div className="library-container grow-library" id="library-container">
                                <p className="library-heading">Library</p>
                                <div className='library-content'>
                                    <div className="playlist-content">{playlistCards}</div>
                                    <div className="album-content">{playlistCards}</div>
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