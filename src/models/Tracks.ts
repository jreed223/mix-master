import { Album, Artist, Features, Image, Track, Playlist } from '../../server/types';
import { audioFeatures } from '../../server/SpotifyData/controllers/supplementalControllers/audioFeatures';
import TrackCollection, { Collection } from './libraryItems';

export default class TrackClass{
    private collection?:TrackCollection|null
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