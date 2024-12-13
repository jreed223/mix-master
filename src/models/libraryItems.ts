import { CategorizedPlaylist, PlaylistItem, Tag, Track, Image, Features, Artist, Album, Playlist, LikedSongs, Tracklist } from "../../server/types";
import TrackClass from "./Tracks";

export type Collection = Playlist | Album["album"] | LikedSongs
export default class TrackCollection {
    type: string;
    id: string;
    image: Image;
    name: string;
    owner?: {display_name: string; external_urls: {spotify: string;}; href: string; id: string; type: string; uri: string;}
    artists?: Artist[];
    realeaseDate?: Date;
    uri: string;
    totalTracks: number;
    categories?: {tag_list: Tag[] | null, top_tags: Record<string, Track[]>|null}|null
    tracks?: TrackClass[]|null
    next?: string|null
    audioFeaturesSet: boolean
    trackDataState?: [{tracks:TrackClass[], audioFeatures: boolean, categories: boolean}]|null

    constructor(
        collection: Collection,
        

    ){
        // console.log("Library Item type in constructor: ",collection)
        this.audioFeaturesSet = false;
        this.type = collection?.type||null
        this.setTracks = this.setTracks.bind(this)

        switch (collection?.type) {

            case 'playlist':
                this.name = collection.name;
                this.id = collection.id
                this.image = collection?.images?.at(0)||{height:0, width: 0, url:null}
                this.name = collection.name
                this.owner = collection.owner
                this.uri = collection.uri
                this.totalTracks = collection.tracks.total
                this.tracks = null
              break;
            case 'album':
                const tracklist = collection.tracks?.items?.map((item)=>{
                    const track = new TrackClass(item, this)
                    return track
                })

                this.name = collection.name;
                this.id = collection.id
                this.image =  collection?.images?.at(0)||{height:0, width: 0, url:null}
                this.name = collection.name
                this.artists = collection.artists
                this.uri = collection.uri
                this.totalTracks = collection.total_tracks
                this.tracks = collection.tracks?.items?.map(item=>new TrackClass(item, this))
                //TODO:Should this be this.tracks?

                this.trackDataState = [{tracks:tracklist, audioFeatures: false, categories: false}]
              break;
            case 'liked songs':
                this.name = "Liked Songs";
                this.id = "Liked Songs";
                this.tracks = collection.items.map(item=>new TrackClass(item.track, this))
                //this.image = libraryItem.images[0]
                //this.owner = libraryItem.
                //this.uri = libraryItem.
                this.totalTracks = collection.total

              break;
            default:
              throw new Error('Invalid Library Item type');
    }
}
    // private isAlbum(libraryItem){
    //     return libraryItem.type === "album"
    // }
    // constructor(
    //     type: string,
    //     id: string,
    //     image: Image,
    //     name: string,
    //     uri: string,
    //     totalTracks : number,
    //     owner?: {display_name: string; external_urls: {spotify: string;}; href: string; id: string; type: string; uri: string;},
    //     artists?: Artist[],
    //     releaseDate?: Date,
    //     tracks?: PlaylistItem[],
    //     categories?: {tag_list: Tag[] | null, top_tags: Record<string, Track[]>|null}|null,
    //     ){
    //         this.type= type
    //         this.id = id;
    //         this.image = image;
    //         this.name = name;
    //         this.owner = owner;
    //         this.artists = artists;
    //         this.realeaseDate = releaseDate;
    //         this.uri = uri;
    //         this.totalTracks = totalTracks;
    //         this.categories = categories?categories:{tag_list:[], top_tags:{}};
    //         this.tracks = tracks?tracks:[];
    //         this.audioFeaturesSet = false;
    // }

    async setTracklist(){
        if(this.type==="playlist"){
            console.log("playlist in set tracks")
            const playlistItems : PlaylistItem[] = await fetch("/spotify-data/playlist-items", {
                method: "GET",
                headers: {"id" : `${this.id}` }
            }).then(async (res)=>{
                const items = await res.json()
                return items
            })
            const tracks = playlistItems.map(item=>new TrackClass(item.track, this))
            this.tracks = tracks
        }
    }

    async getNextTracks(){
        if(this.type==="playlist" && this.next){
            console.log("playlist in set tracks")
            
            const playlistItems : Tracklist = await fetch("/spotify-data/next-playlist-items", {
                method: "POST",
                headers:{
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({next: this.next})
                // headers: {"id" : `${this.id}` }
            },
    ).then(async (res)=>{
                console.log("get next tracks response: ", res)

                const itemData = await res.json()
                console.log("itemdata: ",itemData)
                return itemData
            })
            const tracks = playlistItems.items.map(item=>new TrackClass(item.track, this))
            console.log("tracks: ", tracks)
            const newtracks = this.tracks.concat(tracks)

            this.tracks = newtracks
            this.next = playlistItems.next
            this.audioFeaturesSet=false
            return tracks
        }
    }


    async setTracks(){
        // console.log(this.id)
        console.log("setTracks running")
        if(this.type==="playlist"){
            console.log("playlist in set tracks")
            const playlistItems : {next: string ,items:PlaylistItem[]} = await fetch("/spotify-data/playlist-items", {
                
                method: "GET",
                headers: {"id" : `${this.id}` }
            }).then(async (res)=>{
                const items = await res.json()
                console.log("set tracks response: ", items)
                return items
            })
            const tracks = playlistItems.items.map(item=>{const track = new TrackClass(item.track, this); return track; })
            // const tracks1 = playlistItems.items.map(item=>item.track)
            this.trackDataState = [
                    {tracks: tracks, 
                    audioFeatures: false,
                    categories: false}
                ]
            this.tracks = tracks
            console.log("tracks set in setTrack: ", this.tracks)
            this.next = playlistItems.next
        }
        
        
    }

    async getTracks(){
        if(this.tracks){
            return this.tracks
        }else{
            const tracks = await this.setTracks()
            return tracks
        }
    }
 
    async setCategories(){

        let categories: Record<string, Track[]>= {}
        let tagRecord: Record<string, Tag> = {}
        let topCategories: Record<string, Track[]> = {}

        for(let trackClass of this.tracks){
            const response = await fetch("/lastFM-data/track-tags", {
                method: 'GET',
                headers: {"artist" : encodeURIComponent(trackClass.track.artists[0].name),
                    "track" : encodeURI(trackClass.track.name)
                }
            })
            if(response.ok){
            const tags:Tag[] = await response.json()
            
            //console.log(tags)
            
                for(let tag of tags){
                    if(categories[`${tag.name}`]){
                        categories[`${tag.name}`].push(trackClass.track)
                        //console.log(categories1[`${tag.name}`])
                        if(categories[`${tag.name}`].length >= 4 && tag.name !== "Uncategorized"){
                            //console.log(categories[`${tag.name}`])
                            const importantCat:Track[] = categories[`${tag.name}`]
                            topCategories[`${tag.name}`] = importantCat
    
                            if(!tagRecord[`${tag.name}`]){
                                tagRecord[`${tag.name}`] = tag
                                this.categories.tag_list.push(tag)
                            }
                            
                            //categorizedPlaylist.categories.tag_list.push(tag)
                            this.categories.top_tags[`${tag.name}`] = importantCat
    
                        }
                    }else{
                        //const newCategory:Track[] = {tag: {count:tag.count, name:tag.name, url: tag.url}, tracks: [item.track]}
                        categories[`${tag.name}`] = [trackClass.track]
                        
                    }
                }
            }
    
        }
    }

    getTracksbyTag(tagName:string){
        if(this.categories.top_tags[`${tagName}`]){
            return this.categories.top_tags[`${tagName}`]
        }
    }

    async setAudioFeatures(){
            if(this.tracks&&this.tracks.length>100){
                let startIdx = 0
                let endIdx = 99

                while(startIdx<this.tracks.length){
                    //TODO: Edit Audio features function to receive Track[]
                    let playlistItemsSubset:Track[] = this.tracks.map(trackClass=>trackClass.track).slice(startIdx, endIdx+1)
                    const response = await fetch("/spotify-data/audio-features", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'plain/text'
                          },
                        body: JSON.stringify(playlistItemsSubset)
                    })
                    console.log("audiofeatures response: ", response)
                    const features = await response.json() 

                    console.log("audiofeatures response.json() : ", features)


                    console.log("subset: ", playlistItemsSubset)

                    for(let feature of features){
                        this.tracks[startIdx].audio_features = feature
                        startIdx+=1
                        // console.log(`${this.tracks[startIdx]}, Features: ${feature}`)
                        // console.log(`${this.tracks[startIdx].track.name}, Features: ${feature}`)
                    }
                    startIdx=endIdx
                    endIdx+= 99
                    
                }
                // this.audioFeaturesSet=true
            }else{
                const response = await fetch("/spotify-data/audio-features", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                      },
                    body: JSON.stringify(this.tracks)
                })

                const features:Features[] = await response.json() 

                features.map((feature, index)=>{
                    return this.tracks[index].audio_features = feature
                })
                // this.audioFeaturesSet=true

            }
            this.audioFeaturesSet=true
            return

    }
}