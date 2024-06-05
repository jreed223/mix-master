// Import the express in typescript file
import express from 'express';
import { fetchPlaylistsItems } from './spotify-data/playlist_items';
import { getAccessToken, redirectToAuthCodeFlow, generateCodeChallenge, generateCodeVerifier, refreshTokensThenFetch } from './authentication/AuthHandler';
import { fetchProfile } from './authentication/LoadProfile';
import { fetchPlaylists } from './spotify-data/library';
import type { Playlist, UserProfile } from './types.d.ts';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { error } from 'console';
import bodyParser from 'body-parser';
// declare namespace Express {
//     interface Request {
//       Playlist: import("./types").Playlist;
//     }
//   }
// Initialize the express engine
const app: express.Application = express();
const clientId = "002130106d174cc495fc8443cac019f2";

// Take a port 3000 for running server.
const PORT: number|string = process.env.PORT || 8080;

app.use(express.static("build"))
app.use(cors())
app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
  }));

// Server setup
app.listen(PORT, () => {
	console.log(`TypeScript with Express
		http://localhost:${PORT}/`);
});

// Handling '/' Request
app.get('/', (_req, _res) => {
	_res.send("TypeScript With Express");
});

app.get('/set-cookie',function(req, res){
    const cookie_name = req.headers.cookieName
    const cookie_value = req.headers.cookieVal

    console.log(cookie_name, cookie_value)
    let minute = 60 * 1000;
    if(typeof cookie_name === "string" && typeof cookie_value === "string"){
        res.cookie(cookie_name, cookie_value);
        return res.send('cookie has been set!');
    }
    });
        
app.get("/spotify-data/playlist-items", async (req, res)=>{
    let accessToken = req.cookies? req.cookies["access_token"]:null
    let refreshToken = req.cookies? req.cookies["refresh_token"]:null
    req.body.json().then((playlist: Playlist)=>{
        fetchPlaylistsItems(playlist, accessToken, refreshToken).then(items=>{
            res.send(items)
        })
        .catch((e:Error)=>{
            res.clearCookie('authorizing')
            res.clearCookie('access_token')
            res.clearCookie('refresh_token')
            console.log("issue fetching playlists:", e)
    })

    })
    
})

app.get("/spotify-data/user", async(req, res)=>{
    let accessToken = req.cookies? req.cookies["access_token"]:null
    let refreshToken = req.cookies? req.cookies["refresh_token"]:null

    fetchProfile(accessToken, refreshToken).then(user =>{
        if(user){
            res.send(user)
        }
    })
})


app.get("/spotify-data/user2", async (req, res)=>{
    let accessToken = req.cookies? req.cookies["access_token"]:null
    let refreshToken = req.cookies? req.cookies["refresh_token"]:null

    try{
        await fetch("https://api.spotify.com/v1/me", {
            method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
        }).then(async (result)=>{
            if(result.ok){
                console.log('user response result okay:', result)
                // return result
                console.log('response found fetching profile:', result)
                await result.json().then((user : UserProfile)=>{
                    console.log("fetched user:", user)
                    // userStateCB(user);
                    res.send(user)
                });
    
            }else{ //If unable to fetch profile (access token expired)
                if(refreshToken && refreshToken !== 'undefined'){
                    console.log('AccessToken expired: using refresh token to fetch user')
                    await refreshTokensThenFetch(clientId, refreshToken, "https://api.spotify.com/v1/me").then((user)=>{
                        console.log("fetched user after token refreshed:", user)
                        // userStateCB(user)
                        res.send(user);
                    })
                }else{
                    console.log('access token expired, no refresh token found')
                    // userStateCB(null)
                    return null
                }
            }
        });
    
    }catch(e){
    
        console.log(e);
        return null
    }
        return null

    })

app.get("/spotify-data/init-login", async (req, res)=>{
    // let respomseParams = new URLSearchParams(window.location.search)
    //   let code = respomseParams.get("code")
    let code = req.query.code?req.query.code as string: null;
    let verifier = req.query.verifier?req.query.verifier as string: null;
    console.log(code)
    console.log(verifier)
    if(code&&verifier){
        await getAccessToken(code, verifier).then(async (tokens)=>{
            
            if(tokens){
            res.cookie("access_token", tokens.access_token)
            console.log("retrieving user using token " + tokens.access_token)
        }
            // if(token){
            //     await fetchProfile().then((user)=>
            //         res.send(user)
            //     )
            // }
})
.catch((e)=>{
    res.clearCookie('authorizing')
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    console.log("issue fetching access_token:", e)
})
}
})

app.get("/callback", async (req, res)=>{
    let code = req.query.code?req.query.code as string: null;
    let verifier = req.cookies.verifierKey;
    console.log("CODE: ",code)
    console.log("VERIFIER: ",verifier)
    if(code&&verifier){
        await getAccessToken(code, verifier).then(async (tokens)=>{
            if(tokens){
                res.cookie("access_token", tokens.access_token)
                res.cookie("refresh_token", tokens.refresh_token)
                // await fetchProfile(tokens.access_token, tokens.refresh_token).then(async (user)=>{
                //     res.send(user)
                // }
                // )
                res.redirect("/")
            console.log("retrieving user using token " + tokens.access_token)
        }
            // if(token){
            //     await fetchProfile().then((user)=>
            //         res.send(user)
            //     )
            // }
})
.catch((e)=>{
    res.clearCookie('authorizing')
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    console.log("issue fetching access_token:", e)
})
}
    // const authCode = req.query.code

    // if(typeof authCode === 'string'){
    //     getAccessToken(clientId, authCode).then((token)=>{
    //         console.log("retrieving user using token" + {token})
            
    //         // loadUser(token);
    //       })
    // }


    // let accessToken = req.cookies? req.cookies["access_token"]:null
    // let refreshToken = req.cookies? req.cookies["refresh_token"]:null

    // if(accessToken){
    //     res.clearCookie("authorizing")
    //     await fetchProfile(accessToken, refreshToken).then((user)=>
    //         res.send(user)
    //     ).catch((e)=>{
    //         res.clearCookie('authorizing')
    //         res.clearCookie('access_token')
    //         res.clearCookie('refresh_token')
    //         console.log("issue fetching profile:", e)
    //     })
    // }
})

app.get("/spotify-data/authentication-flow",async (req, res)=>{

    console.log("Authorizing the Application");
    res.cookie('authorizing', 'true');
        const verifier = generateCodeVerifier(128);

    const authLink = await generateCodeChallenge(verifier).then((challenge:string)=>{
        res.cookie("verifierKey", verifier)
        // fetch("http://localhost:8080//set-cookie",{
        //     headers: { "cookieName": "verifierKey", "cookieVal": `${verifier}` }
        //     // body: "verifierKey:" + verifier
        // }
        // )
        // storeData("verifier", verifier);
        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("response_type", "code");
        params.append("redirect_uri", "http://localhost:8080/callback");
        params.append("scope", "user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-top-read user-library-read");
        params.append("code_challenge_method", "S256");
        params.append("code_challenge", challenge);
        const newLink = `https://accounts.spotify.com/authorize?${params.toString()}`
        return newLink
        // document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;

    });
    //fetch(authLink)
    // res.location(authLink);
    console.log("redirecting")
    res.send(authLink)
    // return authLink


}
    // const authLink = await redirectToAuthCodeFlow(clientId);
    // res.redirect(authLink)
)


app.get("/spotify-data/playlists", async (req, res)=>{
    let accessToken = req.cookies? req.cookies["access_token"]:null
    let refreshToken = req.cookies? req.cookies["refresh_token"]:null
    fetchPlaylists(accessToken, refreshToken).then((result)=>res.send(result))
    .catch(e=>{
        res.clearCookie('authorizing')
        res.clearCookie('access_token')
        res.clearCookie('refresh_token')
        console.log("Issue fetching playlists: ", e)
    })
})

// app.get("/callback", async (req, res)=>{

// } )

