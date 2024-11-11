
// Import the express in typescript file
import { Application } from 'express';

// import express, { NextFunction } from 'express';
// import { getAccessToken, generateCodeChallenge, generateCodeVerifier } from '../authentication/AuthHandler';

import { refreshTokens } from '../../app';
import { userProfile } from '../controllers/userControllers/user';
import { authLink } from '../controllers/userControllers/authentication-flow';
import { logout } from '../controllers/userControllers/logout';
import { callback } from '../controllers/userControllers/callback';





export const userRoutes = (app: Application)=>{
    app.get('/logout', logout)

    app.get("/spotify-data/authentication-flow", authLink)

    app.get("/callback", callback)

    app.get("/spotify-data/user", refreshTokens, userProfile)

}










