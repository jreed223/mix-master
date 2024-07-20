import React, { useState } from "react";
import { CategorizedPlaylist, Playlist, PlaylistItem, Tag, Track } from '../../server/types';
import PlaylistClass from "../models/playlistClass";

// const [isLoading, setLoading] = useState(true);
// const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]|null>(null)



async function getTracks(playlistObject:Playlist){
    const playlistItems : PlaylistItem[] = await fetch("/spotify-data/playlist-items", {
        method: "GET",
        headers: {"id" : `${playlistObject.id}` }
    }).then(async (res)=>{
        const items = await res.json()
        return items
    })



    return playlistItems
   

}

async function getTracksAndFeatures(playlist:Playlist){
    const playlistItems = await getTracks(playlist)
    console.log(playlistItems)
    const itemsAndFeatures = await fetch("/spotify-data/audio-features", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(playlistItems)
    }).then(async (res)=>{
        const detailedItems = await res.json()
        return detailedItems
    })
    return itemsAndFeatures

}

// async function getTracksAndTags(playlist:Playlist){
//     console.log(playlist)
//     let playlistItems:PlaylistItem[] = await getTracks(playlist)
//     //console.log(playlistItems)



//     let categories: Record<string, Track[]>= {}
//     let tagRecord: Record<string, Tag> = {}
//     let topCategories: Record<string, Track[]> = {}

//     let categorizedPlaylist : CategorizedPlaylist = {
//         id: playlist.id,
//         image: playlist.images[0],
//         name: playlist.name,
//         owner: playlist.owner,
//         uri: playlist.uri,
//         snapshot_id: playlist.snapshot_id,
//         totalTracks: playlist.tracks.total,
//         categories: {tag_list: [], top_tags:{}},
//         tracks: playlistItems
//     }


//     for(let item of playlistItems){
//         const response = await fetch("/lastFM-data/track-tags", {
//             method: 'GET',
//             headers: {"artist" : encodeURIComponent(item.track.artists[0].name),
//                 "track" : encodeURI(item.track.name)
//             }
//         })
//         if(response.ok){
//         const tags:Tag[] = await response.json()
        
//         //console.log(tags)
        
//             for(let tag of tags){
//                 if(categories[`${tag.name}`]){
//                     categories[`${tag.name}`].push(item.track)
//                     //console.log(categories1[`${tag.name}`])
//                     if(categories[`${tag.name}`].length >= 4 && tag.name !== "Uncategorized"){
//                         //console.log(categories[`${tag.name}`])
//                         const importantCat:Track[] = categories[`${tag.name}`]
//                         topCategories[`${tag.name}`] = importantCat

//                         if(!tagRecord[`${tag.name}`]){
//                             tagRecord[`${tag.name}`] = tag
//                             categorizedPlaylist.categories.tag_list.push(tag)
//                         }
                        
//                         //categorizedPlaylist.categories.tag_list.push(tag)
//                         categorizedPlaylist.categories.top_tags[`${tag.name}`] = importantCat

//                     }
//                 }else{
//                     //const newCategory:Track[] = {tag: {count:tag.count, name:tag.name, url: tag.url}, tracks: [item.track]}
//                     categories[`${tag.name}`] = [item.track]
                    
//                 }
//             }
//         }

//     }

//     console.log(categories)
//     console.log(categorizedPlaylist)
//     return categories

// }




export interface PlaylistCardProps{
    onSelectedPlaylist: (playlist: PlaylistClass) => void
    playlist : PlaylistClass;
}

const PlaylistCard: React.FC<PlaylistCardProps> = (props: PlaylistCardProps)=>{
    //let playlistClass = new PlaylistClass(props.playlist.id, props.playlist.images[0], props.playlist.name,props.playlist.owner, props.playlist.snapshot_id, props.playlist.uri, props.playlist.tracks.total)
    //console.log(props.playlist)
    const [playlistObject, setPlaylistObject] = useState<PlaylistClass|null>(props.playlist)

    console.log('playlistObject:', playlistObject)
    const onPlaylistSelection =  async (event) => {
        event.preventDefault(); // Prevent default behavior if needed
        if(playlistObject.tracks.length <= 0){
            console.log("fetching playlist items")
            playlistObject.setTracks().then(()=>{
                setPlaylistObject(playlistObject)
                console.log(playlistObject)
                props.onSelectedPlaylist(playlistObject)
            })
        }else{
            props.onSelectedPlaylist(playlistObject)
        }
        //await playlistClass.setTracks()
    };

    // console.log(playlist);
    return(
        <div className="playlist-card">
            <span>
            <img className="playlist-img" src={playlistObject.image.url} alt = "playlist cover" onClick={onPlaylistSelection} ></img>
                <div>
                    <p className="playlist-name playlist-card-text">{playlistObject.name!==""?playlistObject.name:"Untititled"}</p>
                    <p className = "playlist-card-text">{playlistObject.owner.display_name}</p>
                    <p className = "playlist-card-text">{playlistObject.totalTracks} tracks</p>
                </div>

            </span>
        </div>
    )

}

export default PlaylistCard