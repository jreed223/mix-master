import type { Album, Artist, Features, Image, Track, Playlist } from '../../server/types.d.ts';
import { audioFeatures } from '../../server/SpotifyData/controllers/supplementalControllers/audioFeatures.ts';
import TrackCollection, { Collection } from './TrackCollection.ts';

export default class TrackClass{
    collection?:TrackCollection|null
    track: Track
    audio_features?: Features|null

    constructor(track:Track, collection?:TrackCollection){
        // console.log("COLLECTION passed to Track:", collection)
        this.track = track
        this.collection= collection?collection:null
        
    }
  

    getCollection(){
        return this.collection
    }

    // setCollection(collection: TrackCollection){
    //     this.collection = collection

    // }
}