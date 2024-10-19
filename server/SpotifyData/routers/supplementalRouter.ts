
import  { refreshTokens } from '../../app';
import { nextItems } from '../controllers/supplementalControllers/nextItems';
import { searchResults } from '../controllers/supplementalControllers/searchResults';
import { audioFeatures } from '../controllers/supplementalControllers/audioFeatures';
import { trackTags } from '../controllers/supplementalControllers/trackTags';
import { Application } from 'express';


export const supplementalRoutes = (app: Application)=>{
    app.post("/spotify-data/next-playlist-items", refreshTokens, nextItems)

    app.get("/spotify-data/search-results", refreshTokens, searchResults)

    app.post("/spotify-data/audio-features", refreshTokens, audioFeatures)

    app.get("/lastFM-data/track-tags", trackTags)
}



