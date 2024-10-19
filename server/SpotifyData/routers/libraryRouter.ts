
// Import the express in typescript file
import express, { Request, Response, NextFunction, Application } from 'express';

// import express, { NextFunction } from 'express';
// import { getRefreshToken } from '../../authentication/AuthHandler';
import type { Album, AlbumList, Playlist, PlaylistItem, Tracklist } from '../../types';
import { refreshTokens } from '../../app';

import { albums } from '../controllers/libraryControllers/albums';
import { likedSongs } from '../controllers/libraryControllers/liked-songs';
import { playlists } from '../controllers/libraryControllers/playlists';
import { playlistItems } from '../controllers/libraryControllers/playlist-items';






export const libraryRoutes = (app: Application)=>{
    app.get("/spotify-data/albums", albums)

    app.get("/spotify-data/liked-songs", likedSongs)

    app.get("/spotify-data/playlists", refreshTokens, playlists)

    app.get("/spotify-data/playlist-items", refreshTokens, playlistItems)


}







