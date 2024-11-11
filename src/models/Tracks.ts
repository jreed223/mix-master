import { Album, Artist, Features, Image, Track, Playlist } from '../../server/types';
import { audioFeatures } from '../../server/SpotifyData/controllers/supplementalControllers/audioFeatures';
import TrackCollection, { Collection } from './libraryItems';

export default class TrackClass{
    constructor(track:Track, collection?:TrackCollection){
        this.track = track
        this.collection= collection?collection:null
        
    }
    track: Track
    private collection?:TrackCollection|null
    audio_features?: Features|null

    getCollection(){
        return this.collection
    }
}