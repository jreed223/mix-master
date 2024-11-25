
// Import the express in typescript file
import express, { Request as expressRequest, Response as expressResponse, NextFunction } from 'express';

// import { Playlist } from '../../types';
// import express, { NextFunction } from 'express';
// import { getRefreshToken } from './authentication/AuthHandler';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import { userRoutes } from './SpotifyData/routers/userRouter';
import { draftingPaneRoutes, searchBarRoutes } from './SpotifyData/routers/supplementalRouter';
import { libraryRoutes } from './SpotifyData/routers/libraryRouter';

type FetchResponse = Response;  //Fetch API Response

// import { Tracklist, Playlist } from './types';

// Initialize the express engine
const app: express.Application = express();
const clientId = "002130106d174cc495fc8443cac019f2";

// Take a port 3000 for running server.
// const PORT: number|string = process.env.PORT || 8080;

const PORT: number|string = process.env.PORT || 8080;


app.listen(PORT, () => {
	console.log(`TypeScript with Express
		http://localhost:${PORT}/`);
});

// app.get('/', (_req, _res) => {
// 	_res.send("TypeScript With Express");
// });

/** Send POST request to Spotify API to retrieve new tokens. Should only run if access token has expired. */
export async function getRefreshToken(clientId: string, refreshToken: string) : Promise<FetchResponse> {
    console.log("refreshing tokens with: ", refreshToken)
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("refresh_token", refreshToken);
    params.append("grant_type", "refresh_token");

// try{
    //Grabs token after account has been verified
    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });
    // console.log( "response from getRefreshToken: ", res)

    return res

}

export async function refreshTokens (req: expressRequest, res: expressResponse, next: NextFunction){
    const accessToken = req.cookies["access_token"]
    const refreshToken = req.cookies["refresh_token"]
    //console.log(accessToken)

    const expirationDate = new Date(req.cookies["expires"])
    const currentTime = new Date(Date.now()-60*1000*5)
    

    if((currentTime> expirationDate)||typeof accessToken === "undefined" ){
        const response = await getRefreshToken(clientId, refreshToken)
            // console.log("response from refreshTokens: ",response)

            if(response.ok){
                const tokens = await response.json()
                console.log("tokens refreshed: ", tokens)

                const access_token = tokens.access_token
                const refresh_token = tokens.refresh_token
                const expiration = new Date(Date.now()+tokens.expires_in*1000)

                res.cookie("access_token", access_token, {maxAge:tokens.expires_in*1000})
                res.locals.access_token = access_token
                res.cookie("refresh_token", refresh_token, {maxAge:2592000*1000})
                res.cookie("expires",expiration, {maxAge:tokens.expires_in*1000})

                // res.send(tokens)
                next()
            }else{
                const error = await response.json()
                console.error("Bad response refreshing tokens:", error)
                // res.clearCookie('access_token')
                // res.clearCookie('refresh_token')
                return res.redirect('/logout')
            }

        
    }else{
        next()
    }
    
}


app.use(express.static(".././build"))
app.use(cors())
app.use(cookieParser());
app.use(express.json({limit: '50mb'}));



app.use(express.static(".././build"))

userRoutes(app)
// supplementalRoutes(app)
searchBarRoutes(app)
draftingPaneRoutes(app)
libraryRoutes(app)



// // Handling '/' Request



export default app




