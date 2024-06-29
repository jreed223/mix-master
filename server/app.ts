// Import the express in typescript file
import express, { Request, Response, NextFunction } from 'express';

// import express, { NextFunction } from 'express';
import { fetchPlaylistsItems } from './spotify-data/playlist_items';
import { getAccessToken, generateCodeChallenge, generateCodeVerifier, getRefreshToken } from './authentication/AuthHandler';
import { fetchProfile } from './authentication/LoadProfile';
import { fetchPlaylists } from './spotify-data/library';
import type { Playlist, PlaylistItems, UserProfile } from './types.d.ts';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { error } from 'console';
import bodyParser from 'body-parser';

// Initialize the express engine
const app: express.Application = express();
const clientId = "002130106d174cc495fc8443cac019f2";

// Take a port 3000 for running server.
const PORT: number|string = process.env.PORT || 8080;


function refreshTokens (req: Request, res: Response, next: NextFunction){
    const accessToken = req.cookies["access_token"]
    const refreshToken = req.cookies["refresh_token"]
    console.log(accessToken)

    const expirationDate = new Date(req.cookies["expires"])
    const currentTime = new Date(Date.now()-60*1000*5)
    

    if((currentTime> expirationDate)||typeof accessToken === "undefined" ){
        getRefreshToken(clientId, refreshToken).then(async (response)=>{
            console.log("response from spotify-data/refresh-token: ",response)

            if(response.ok){
                console.log("tokens refreshed")
                const tokens = await response.json()
                const access_token = tokens.access_token
                const refresh_token = tokens.refresh_token
                const expiration = new Date(Date.now()+tokens.expires_in*1000)

                res.cookie("access_token", access_token, {maxAge:tokens.expires_in*1000})
                res.cookie("refresh_token", refresh_token, {maxAge:2592000*1000})
                res.cookie("expires",expiration, {maxAge:tokens.expires_in*1000})
                console.log(tokens)
                console.log(access_token, refresh_token)
                console.log("Tokens successfully refreshed");
                res.send(tokens)
                next()
            }else{
                const error = await response.json()
                console.log("Bad response refreshing tokens:", error)
                // res.clearCookie('access_token')
                // res.clearCookie('refresh_token')
                return res.redirect('/logout')
            }

        })
    }
    next()
    
}


app.use(express.static("build"))
app.use(cors())
app.use(cookieParser());


// Server setup
app.listen(PORT, () => {
	console.log(`TypeScript with Express
		http://localhost:${PORT}/`);
});

// Handling '/' Request
app.get('/', (_req, _res) => {
	_res.send("TypeScript With Express");
});



app.get('/logout', (req, res)=>{
    res.clearCookie('authorizing')
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    res.redirect('/')

})

app.get("/spotify-data/authentication-flow",async (req, res)=>{

    console.log("Authorizing the Application");
    // res.cookie('authorizing', 'true');
        const verifier = generateCodeVerifier(128);

    const authLink = await generateCodeChallenge(verifier).then((challenge:string)=>{
        res.cookie("verifierKey", verifier)

        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("response_type", "code");
        params.append("redirect_uri", "http://localhost:8080/callback");
        params.append("scope", "user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-top-read user-library-read");
        params.append("code_challenge_method", "S256");
        params.append("code_challenge", challenge);
        const newLink = `https://accounts.spotify.com/authorize?${params.toString()}`
        return newLink

    });
    console.log("redirecting")
    res.send(authLink)
})

app.get("/callback", (req, res)=>{
    let code = req.query.code?req.query.code as string: null;
    let verifier = req.cookies.verifierKey;
    res.clearCookie('verifierKey')
    console.log("CODE: ",code)
    console.log("VERIFIER: ",verifier)
    if(code&&verifier){
        getAccessToken(code, verifier).then(async (response)=>{
            if(response.ok){
                
                const tokens  = await response.json()//If tokens are retrieved successfully, store them
                const expiration = new Date(Date.now()+tokens.expires_in*1000)

                res.cookie("access_token", tokens.access_token, {maxAge:tokens.expires_in*1000})
                res.cookie("refresh_token", tokens.refresh_token, {maxAge:2592000*1000})
                res.cookie("expires",expiration, {maxAge:tokens.expires_in*1000})
                console.log('tokensfound:', tokens)
                console.log(`tokens{access: ${tokens.access_token}, refresh: ${tokens.refresh_token}}`)
                console.log("retrieving user using token " + tokens.access_token)
                res.redirect("/")

            }else{
                const error = await response.json()
                console.error("issue authorizing user:", error)
            }

})
.catch((e)=>{
    // res.clearCookie('authorizing')
    // res.clearCookie('access_token')
    // res.clearCookie('refresh_token')
    console.log("issue fetching authorizing user:", e)
})
}

})



app.get('/spotify-data/access-token',async (req, res)=>{
    let code = req.query.code?req.query.code as string: null;
    let verifier = req.query.verifier?req.query.verifier as string: null;
    console.log(code)
    console.log(verifier)
    if(code&&verifier){
        await getAccessToken(code, verifier).then(async (response)=>{
            if(response.ok){
                const tokens = await response.json()
                const access_token = tokens.access_token
                const refresh_token = tokens.refresh_token
                
                res.cookie("access_token", access_token, {maxAge:tokens.expires_in*1000})
                res.cookie("refresh_token", refresh_token, {maxAge:2592000*1000})
                // console.log('tokens:',tokens)
                //console.log(access_token, refresh_token)
            }else{
                const error = await response.json()
                res.status(400).send(error)
            }

})
// .catch((e)=>{
//     res.clearCookie('authorizing')
//     res.clearCookie('access_token')
//     res.clearCookie('refresh_token')
//     console.log("issue fetching access_token:", e)
// })
}

})

app.get('/spotify-data/refresh-token',async (req, res)=>{
    const refreshToken = req.cookies.refresh_token
    // let refreshToken = req.cookies? req.cookies["refresh_token"]:null
    console.log("refreshToken: ",refreshToken)
    const response = await getRefreshToken(clientId, refreshToken)
    console.log("response from spotify-data/refresh-token: ",response)

     if(response.ok){
        const tokens = await response.json()
        const access_token = tokens.access_token
        const refresh_token = tokens.refresh_token
        

        res.cookie("access_token", access_token, {maxAge:tokens.expires_in*1000})
        res.cookie("refresh_token", refresh_token, {maxAge:2592000*1000})
        console.log(tokens)
        console.log(access_token, refresh_token)
        console.log("Tokens successfully refreshed");
        res.send(tokens)
     }else{
        const error = await response.json()
        res.status(400).send(error)
     }
})

app.get("/spotify-data/user", refreshTokens, async(req, res)=>{
    let accessToken = req.cookies? req.cookies["access_token"]:null
    let refreshToken = req.cookies? req.cookies["refresh_token"]:null
    // let accessToken = req.cookies["access_token"]
    // let refreshToken = req.cookies["refresh_token"]
    console.log(`tokens from cookies in /spotify-data/user{ \n access: ${accessToken} \n refresh: ${refreshToken}}`)

    fetchProfile(accessToken, refreshToken).then(async response =>{
        if(response.ok){
            console.log("OK response from spotify-data/user: ",response)
            const user : UserProfile  = await response.json()
            res.send(user)
        }else{
            const error = await response.json()
            console.error("issue fetching user:", error)
        }
    })
    .catch((e:Error)=>{
        // res.clearCookie('authorizing')
        // res.clearCookie('access_token')
        // res.clearCookie('refresh_token')
        res.redirect("/")
})
})

app.get("/spotify-data/playlists", async (req, res)=>{
    let accessToken = req.cookies? req.cookies["access_token"]:null
    let refreshToken = req.cookies? req.cookies["refresh_token"]:null
    console.log(req.cookies)
    fetchPlaylists(accessToken, refreshToken).then(async (response)=>{
        if(response.ok){
            console.log("OK response from spotify-data/playlists: ",response)
            const playlistsObject = await response.json();
            const playlistList: Playlist[] = playlistsObject["items"];
            res.send(playlistList)
        }else{
            const error = await response.json()
            console.error("issue fetching playlists:", error)
        }
    })
    .catch(e=>{
        // res.clearCookie('authorizing')
        // res.clearCookie('access_token')
        // res.clearCookie('refresh_token')
        console.log("Issue fetching playlists: ", e)
    })
})
        

app.get("/spotify-data/playlist-items", async (req, res)=>{
    let accessToken = req.cookies? req.cookies["access_token"]:null
    let refreshToken = req.cookies? req.cookies["refresh_token"]:null
    console.log(req.headers)
    
    if(typeof req.headers['id'] === "string"){
        const playlistId = req.headers['id']

        console.log(playlistId)
        fetchPlaylistsItems(playlistId, accessToken, refreshToken).then(async (response)=>{
            if(response.ok){
                console.log("OK response from spotify-data/playlist-items: ",response)
                const playlistObject = await response.json();
                const playlistItems: PlaylistItems[] = playlistObject["items"];
                console.log(playlistItems)
                res.send(playlistItems)
            }else{
                const error = await response.json()
                console.error("issue fetching playlist items:", error)
            }
        })
        .catch((e:Error)=>{
            // res.clearCookie('authorizing')
            // res.clearCookie('access_token')
            // res.clearCookie('refresh_token')
            
            console.log("issue fetching playlist items:", e)
    })
}else{
    console.log("Typer error with Playlist ID, Playlist ID: ", req.headers['id'])
}
  
    
    
})















