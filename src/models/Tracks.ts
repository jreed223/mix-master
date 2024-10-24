import { Album, Artist, Features, Image, Track, Playlist } from '../../server/types';
import { audioFeatures } from '../../server/SpotifyData/controllers/supplementalControllers/audioFeatures';
import { Collection } from './libraryItems';

export default class TrackClass{
    constructor(track:Track, collection?:Collection){
        this.track = track
        this.collection= collection?collection:null
        
    }
    track: Track
    private collection?:Collection|null
    audio_features?: Features|null
}