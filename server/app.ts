// Import the express in typescript file
import express, { Request, Response, NextFunction } from 'express';

// import express, { NextFunction } from 'express';
import { fetchPlaylistsItems } from './spotify-data/playlist_items';
import { getAccessToken, generateCodeChallenge, generateCodeVerifier, getRefreshToken } from './authentication/AuthHandler';
import { fetchProfile } from './authentication/LoadProfile';
import { fetchPlaylists } from './spotify-data/playlists';
import type { Features, Playlist, PlaylistItem, Tracklist, UserProfile } from './types.d.ts';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fetchLikedTracks } from './spotify-data/saved-songs';
import { error } from 'console';
import { fetchAudioFeatures } from './spotify-data/audio-features';
import { access } from 'fs';
// import { Tracklist, Playlist } from './types';


// Initialize the express engine
const app: express.Application = express();
const clientId = "002130106d174cc495fc8443cac019f2";

// Take a port 3000 for running server.
const PORT: number|string = process.env.PORT || 8080;


async function refreshTokens (req: Request, res: Response, next: NextFunction){
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



app.use(express.static("build"))
app.use(cors())
app.use(cookieParser());
app.use(express.json({limit: '50mb'}));


// Server setup
app.listen(PORT, () => {
	console.log(`TypeScript with Express
		http://localhost:${PORT}/`);
});

app.use(express.static("build"))

// Handling '/' Request
app.get('/', (_req, _res) => {
	_res.send("TypeScript With Express");
});



app.get('/logout', (req, res)=>{
    console.log("logging out")
    res.clearCookie('expires')
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    res.redirect('/')

})

app.get("/spotify-data/authentication-flow",async (req, res)=>{

    //console.log("Authorizing the Application");
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
        console.log("Authetication link: ", newLink)
        return newLink

    }).catch(e=>{
        console.error("Fetch operation failed (/authetication-flow):", e)

    })
    //console.log("redirecting")
    res.send(authLink)
})

app.get("/callback", (req, res)=>{
    const code = req.query.code?req.query.code as string: null;
    const verifier = req.cookies.verifierKey;
    res.clearCookie('verifierKey')
    //console.log("CODE: ",code)
    //console.log("VERIFIER: ",verifier)
    if(code&&verifier){
        getAccessToken(code, verifier).then(async (response)=>{
            if(response.ok){
                console.log("OK response from /callback")
                const tokens  = await response.json()//If tokens are retrieved successfully, store them
                const expiration = new Date(Date.now()+tokens.expires_in*1000)

                res.cookie("access_token", tokens.access_token, {maxAge:tokens.expires_in*1000})
                res.cookie("refresh_token", tokens.refresh_token, {maxAge:2592000*1000})
                res.cookie("expires",expiration, {maxAge:tokens.expires_in*1000})
                //console.log('tokens found duting authentication: ', tokens)
                //console.log(`tokens{access: ${tokens.access_token}, refresh: ${tokens.refresh_token}}`)
                //console.log("retrieving user using token " + tokens.access_token)
                res.redirect("/")

            }else{
                const error = await response.json()
                console.error("Failed to retrieve access token (/callback):", error)
            }

        }).catch((e)=>{
            // res.clearCookie('authorizing')
            // res.clearCookie('access_token')
            // res.clearCookie('refresh_token')
            console.error("Fetch operation failed (/callback):", e)
        })
    }else{
        console.error("Code||Verifier not found (callback)")
    }

})





app.get("/spotify-data/user", refreshTokens, async(req, res)=>{
    const accessToken = req.cookies.access_token? req.cookies.access_token:res.locals.access_token
    // let accessToken = req.cookies["access_token"]
    // let refreshToken = req.cookies["refresh_token"]
    //console.log(`tokens from cookies in /spotify-data/user{ \n access: ${accessToken} \n refresh: ${refreshToken}}`)
    if(accessToken){
        fetchProfile(accessToken).then(async response =>{
            if(response.ok){
                console.log("OK response from spotify-data/user")
                const user : UserProfile  = await response.json()
                res.send(user)
            }else{
                const error = await response.json()
                console.error("Failed to retrieve user (/spotify-data/user): ", error)
            }
        })
        .catch((e:Error)=>{
            // res.clearCookie('authorizing')
            // res.clearCookie('access_token')
            // res.clearCookie('refresh_token')
            console.error("Fetch operation failed (/spotify-data/user)): ", e)
        })
    }else{
        console.error("No access token found (/spotify-data/user)")
    }
})

app.get("/spotify-data/playlists", refreshTokens, async (req, res)=>{
    const accessToken = req.cookies.access_token? req.cookies.access_token:res.locals.access_token
    //console.log(req.cookies)
    if(accessToken){
        fetchPlaylists(accessToken).then(async (response)=>{
            if(response.ok){
                console.log("OK response from spotify-data/playlists")
                const playlistsObject = await response.json();
                const playlistList: Playlist[] = playlistsObject["items"];
                res.send(playlistList)
            }else{
                const error = await response.json()
                console.error("Failed to retrieve playlists (/spotify-data/playlists): ", error)
            }
        })
        .catch(e=>{
            // res.clearCookie('authorizing')
            // res.clearCookie('access_token')
            // res.clearCookie('refresh_token')
            console.error("Fetch operation failed (/spotify-data/playlists)): ", e)
        })
    }else{
        console.error("No access token found (/spotify-data/playlists)")
    }
})
        


app.get("/spotify-data/playlist-items", refreshTokens, async (req, res)=>{
    const accessToken = req.cookies.access_token? req.cookies.access_token:res.locals.access_token
    // console.log(req.headers)
    // console.log(accessToken)
    
    if(typeof req.headers['id'] === "string" && typeof accessToken !== "undefined"){
        const playlistId = req.headers['id']
        let allPlaylistItems : PlaylistItem[] = []
        let offset = 0
        // console.log(playlistId)
        while(true){

            const playlistObject = await fetchPlaylistsItems(playlistId, offset, accessToken).then(async (response) => {

                if(response.ok){
                    console.log("OK response from spotify-data/playlist-items")
                    const playlistObject:Tracklist = await response.json();
                    return playlistObject
                }else{
                    const error = await response.json()
                    console.error("Failed to retrieve playlist items (/spotify-data/playlist-items): ", error)
                    // res.redirect('/logout')
                    return
                }
            }).catch((e:Error)=>{
            // res.clearCookie('authorizing')
            // res.clearCookie('access_token')
            // res.clearCookie('refresh_token')
            console.error("Fetch operation failed (/spotify-data/playlist-items): ", e)
            })

            if(playlistObject){
                const playlistItems: PlaylistItem[] = playlistObject.items;
                for(let i = playlistItems.length-1; i>=0; i--){
                    // console.log(`Track #${i} `, playlistItems[i].track)
                    if(playlistItems[i].track===null){
                        console.error(`Playlist item #${i} contains an invalid track`)
                        playlistItems.splice(i,1)
                    }
                }
                allPlaylistItems = allPlaylistItems.concat(playlistItems)
                //console.log(`Playlist items batch #${offset}: `, playlistItems)
                if(playlistObject.next){
                    offset+=1
                    console.log("offset: ",offset)
                }else{
                    //console.log("All Playlist Items: ",allPlaylistItems)
                    console.log("Total playlist items found: ", allPlaylistItems.length)
                    res.send(allPlaylistItems)

                    return
                }

            }else{
                console.error("No playlist object found (/spotify-data/playlist-items)")
            }
        }
    }else{
        console.error("No playlistID||accesstoken found (/spotify-data/playlist-items): ", `id=${req.headers['id']}, accesstoken=${accessToken}`)
    }
})

app.post("/spotify-data/audio-features", refreshTokens, async (req, res)=>{
    const accessToken = req.cookies.access_token?req.cookies.access_token:res.locals.access_token
    const playlistItems:PlaylistItem[] = req.body
    //console.log(req.body)
    //console.log("items from audio features:",playlistItems)
    var startIdx = 0
    var endIdx = 99
    if(accessToken&&playlistItems){
        while(true){
            
            if(endIdx>=playlistItems.length){
                endIdx = playlistItems.length-1
            }
            // console.log(startIdx,endIdx)
            //console.log(accessToken, playlistItems)
            let playlistItemsSubset:PlaylistItem[] = playlistItems.slice(startIdx, endIdx+1)

            let audioFeatures= await fetchAudioFeatures(playlistItemsSubset, accessToken).then(async(response)=>{
                if(response.ok){
                    console.log("OK response from spotify-data/audio-features")
                    const audioFeaturesObject = await response.json();
                    const audioFeatures = audioFeaturesObject.audio_features
                    return audioFeatures
                }else{
                    const error = await response.json()
                    console.error("Failed to retrieve audio features (/spotify-data/audio-features): ", error)
                    return
                }
            }).catch((e:Error)=>{
                // res.clearCookie('authorizing')
                // res.clearCookie('access_token')
                // res.clearCookie('refresh_token')
                console.error("Fetch operation failed (/spotify-data/audio-features)): ", e)
            })

            if(audioFeatures){
                // console.log("Audio Features loop started")
                for(let item of audioFeatures){
                    // console.log(`Audio Features found for song ${startIdx+1}: ${playlistItems[startIdx].track.name}`)
                    playlistItems[startIdx].track.audio_features = item
                    startIdx+=1
                }

                if(startIdx >= playlistItems.length){
                    console.log("Total audio features found: ", startIdx)
                    res.send(playlistItems)
                    return
                }
            }else{
                console.error("No audio features found (/spotify-data/audio-features)")
            }

            startIdx+=1
            endIdx+=100


        }
    }else{
        console.error("No playlistItems||accessToken found (/spotify-data/audio-features)")

    }
})




app.get("/spotify-data/liked-songs", async (req, res)=>{
    let accessToken = req.cookies? req.cookies["access_token"]:null
    console.log(req.cookies)
    fetchLikedTracks(accessToken).then(async (response)=>{
        if(response.ok){
            console.log("OK response from spotify-data/liked-songs: ",response)
            const playlistsObject: Tracklist = await response.json();
            const playlistList: PlaylistItem[] = playlistsObject.items;
            res.send(playlistList)
        }else{
            const error = await response.json()
            console.error("issue fetching liked songs:", error)
        }
    })
    .catch(e=>{
        // res.clearCookie('authorizing')
        // res.clearCookie('access_token')
        // res.clearCookie('refresh_token')
        console.log("Issue fetching liked songs: ", e)
    })
})















