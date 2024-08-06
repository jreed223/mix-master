import { CategorizedPlaylist, PlaylistItem, Tag, Track, Image, Features, Artist, Album, Playlist, LikedSongs } from "../../server/types";

type LibraryItem = Playlist | Album["album"] | LikedSongs
export default class Library {
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
    tracks: Track[]
    audioFeaturesSet: boolean

    constructor(
        libraryItem: LibraryItem,
        

    ){
        switch (libraryItem.type) {
            case 'playlist':
                this.name = libraryItem.name;
                this.id = libraryItem.id
                this.image = libraryItem.images[0]
                this.name = libraryItem.name
                this.owner = libraryItem.owner
                this.uri = libraryItem.uri
                this.totalTracks = libraryItem.tracks.total
              break;
            case 'album':
                this.name = libraryItem.name;
                this.id = libraryItem.id
                this.image = libraryItem.images[0]
                this.name = libraryItem.name
                this.artists = libraryItem.artists
                this.uri = libraryItem.uri
                this.totalTracks = libraryItem.total_tracks
                this.tracks = libraryItem.tracks.items
              break;
            case 'liked songs':
                this.name = "Liked Songs";
                this.id = "Liked Songs";
                this.tracks = libraryItem.items.map(item=>item.track)
                //this.image = libraryItem.images[0]
                //this.owner = libraryItem.
                //this.uri = libraryItem.
                this.totalTracks = libraryItem.total

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



    async setTracks(){
        if(this.type==="playlist"){
            const playlistItems : PlaylistItem[] = await fetch("/spotify-data/playlist-items", {
                method: "GET",
                headers: {"id" : `${this.id}` }
            }).then(async (res)=>{
                const items = await res.json()
                return items
            })
            const tracks = playlistItems.map(item=>item.track)
            this.tracks = tracks
        }
        switch (this.type) {
            case 'playlist':
                
              break;
            case 'album':

              break;
            case 'liked songs':

              break;
            default:
              throw new Error('Invalid Library Item type'); 
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

        for(let track of this.tracks){
            const response = await fetch("/lastFM-data/track-tags", {
                method: 'GET',
                headers: {"artist" : encodeURIComponent(track.artists[0].name),
                    "track" : encodeURI(track.name)
                }
            })
            if(response.ok){
            const tags:Tag[] = await response.json()
            
            //console.log(tags)
            
                for(let tag of tags){
                    if(categories[`${tag.name}`]){
                        categories[`${tag.name}`].push(track)
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
                        categories[`${tag.name}`] = [track]
                        
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
            if(this.tracks.length>100){
                let startIdx = 0
                let endIdx = 99

                while(startIdx<this.tracks.length){
                    //TODO: Edit Audio features function to receive Track[]
                    let playlistItemsSubset:Track[] = this.tracks.slice(startIdx, endIdx+1)
                    const response = await fetch("/spotify-data/audio-features", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                          },
                        body: JSON.stringify(playlistItemsSubset)
                    })

                    const features = await response.json() 
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