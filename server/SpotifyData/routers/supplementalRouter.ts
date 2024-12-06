
import  { refreshTokens } from '../../app';
import { nextItems } from '../controllers/supplementalControllers/nextItems';
import { searchResults } from '../controllers/supplementalControllers/searchResults';
import { audioFeatures } from '../controllers/supplementalControllers/audioFeatures';
import { trackTags } from '../controllers/supplementalControllers/trackTags';
import { Application } from 'express';
import { album } from '../controllers/supplementalControllers/album';
import { artistAlbums } from '../controllers/supplementalControllers/artistAlbums';
import { addTracks } from '../controllers/add-remove-items';
import { newPlaylist } from '../controllers/create-playlist';


// export const supplementalRoutes = (app: Application)=>{
//     app.post("/spotify-data/next-playlist-items", refreshTokens, nextItems)

//     // app.post("/spotify-data/search-results", refreshTokens, searchResults)

//     app.post("/spotify-data/audio-features", refreshTokens, audioFeatures)

//     app.get("/lastFM-data/track-tags", trackTags)

//     // app.post("/spotify-data/album", album)

//     // app.post("/spotify-data/artistAlbums", artistAlbums)
// }

export const draftingPaneRoutes  = (app: Application)=>{
    app.post("/spotify-data/next-playlist-items", refreshTokens, nextItems)
    app.post("/spotify-data/audio-features", refreshTokens, audioFeatures)
    app.get("/lastFM-data/track-tags", trackTags)
    app.post("/spotify-data/create-playlist", refreshTokens, newPlaylist)
    app.post("/spotify-data/add-tracks", refreshTokens, addTracks)




}

export const searchBarRoutes = (app: Application)=>{
    app.post("/spotify-data/search-results", refreshTokens, searchResults)
    app.post("/spotify-data/album",refreshTokens, album)
    app.post("/spotify-data/artistAlbums",refreshTokens, artistAlbums)

    
}




