// Import the express in typescript file
import express from 'express';
import { fetchPlaylistsItems } from './spotify-data/playlist_items';
import { getAccessToken, redirectToAuthCodeFlow } from './authentication/AuthHandler';
import { fetchProfile } from './authentication/LoadProfile';
import { fetchPlaylists } from './spotify-data/library';
import type { Playlist } from './types.d.ts';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { error } from 'console';
// declare namespace Express {
//     interface Request {
//       Playlist: import("./types").Playlist;
//     }
//   }
// Initialize the express engine
const app: express.Application = express();

// Take a port 3000 for running server.
const PORT: number|string = process.env.PORT || 8080;

app.use(express.static("build"))
app.use(cors({
    origin: '*'
}))
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

app.get('/set-cookie',function(req, res){
    const cookie_name = req.body.name
    const cookie_value = req.body.val
    let minute = 60 * 1000;
    res.cookie(cookie_name, cookie_value);
    return res.send('cookie has been set!');
    });
        
app.get("/spotify-data/playlist-items", async (req, res)=>{
    let accessToken = req.cookies? req.cookies["access_token"]:null
    let refreshToken = req.cookies? req.cookies["refresh_token"]:null
    await req.body.json().then((playlist: Playlist)=>{
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


app.get("/spotify-data/user", async (req, res)=>{
    let accessToken = req.cookies? req.cookies["access_token"]:null
    let refreshToken = req.cookies? req.cookies["refresh_token"]:null

            await fetchProfile(accessToken, refreshToken).then((user)=>{
                console.log(user)
                res.send(user)
            })
            .catch((e:Error)=>{
                res.clearCookie('authorizing')
                res.clearCookie('access_token')
                res.clearCookie('refresh_token')
                console.log("issue fetching profile:", e)
        })

    })

app.get("/spotify-data/init-login", async (req, res)=>{
    // let respomseParams = new URLSearchParams(window.location.search)
    //   let code = respomseParams.get("code")
    let code = req.query.code?req.query.code as string: null;
    let verifier = req.query.verifier?req.query.verifier as string: null;
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
    let accessToken = req.cookies? req.cookies["access_token"]:null
    let refreshToken = req.cookies? req.cookies["refresh_token"]:null

    if(accessToken){
        res.clearCookie("authorizing")
        await fetchProfile(accessToken, refreshToken).then((user)=>
            res.send(user)
        ).catch((e)=>{
            res.clearCookie('authorizing')
            res.clearCookie('access_token')
            res.clearCookie('refresh_token')
            console.log("issue fetching profile:", e)
        })
    }
})


app.get("/spotify-data/authentication-flow",async (req, res)=>{
    const clientId = "002130106d174cc495fc8443cac019f2";
    console.log("Authorizing the Application");
    res.cookie('authorizing', 'true');
    redirectToAuthCodeFlow(clientId);
})

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

app.get("/callback", )

