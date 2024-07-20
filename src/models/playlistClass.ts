import { CategorizedPlaylist, PlaylistItem, Tag, Track, Image } from "../../server/types";

export default class PlaylistClass implements CategorizedPlaylist{
    id: string;
    image: Image;
    name: string;
    owner: {display_name: string; external_urls: {spotify: string;}; href: string; id: string; type: string; uri: string;}
    snapshot_id: string;
    uri: string;
    totalTracks: number;
    categories?: {tag_list: Tag[] | null, top_tags: Record<string, Track[]>|null}|null
    tracks?: PlaylistItem[]


    constructor(id: string,
        image: Image,
        name: string,
        owner: {display_name: string; external_urls: {spotify: string;}; href: string; id: string; type: string; uri: string;},
        snapshot_id: string,
        uri: string,
        totalTracks : number,
        tracks?: PlaylistItem[],
        categories?: {tag_list: Tag[] | null, top_tags: Record<string, Track[]>|null}|null,
        ){
            this.id = id;
            this.image = image;
            this.name = name;
            this.owner = owner;
            this.snapshot_id = snapshot_id;
            this.uri = uri;
            this.totalTracks = totalTracks;
            this.categories = categories?categories:{tag_list:[], top_tags:{}};
            this.tracks = tracks?tracks:[];
    }

    async setTracks(){
        const playlistItems : PlaylistItem[] = await fetch("/spotify-data/playlist-items", {
            method: "GET",
            headers: {"id" : `${this.id}` }
        }).then(async (res)=>{
            const items = await res.json()
            return items
        })
        this.tracks = playlistItems
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

        for(let item of this.tracks){
            const response = await fetch("/lastFM-data/track-tags", {
                method: 'GET',
                headers: {"artist" : encodeURIComponent(item.track.artists[0].name),
                    "track" : encodeURI(item.track.name)
                }
            })
            if(response.ok){
            const tags:Tag[] = await response.json()
            
            //console.log(tags)
            
                for(let tag of tags){
                    if(categories[`${tag.name}`]){
                        categories[`${tag.name}`].push(item.track)
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
                        categories[`${tag.name}`] = [item.track]
                        
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

}