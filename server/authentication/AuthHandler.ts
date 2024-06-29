
import { createHash } from "crypto";



// export async function refreshTokensThenFetch(clientId:string, refreshToken:string, endpoint:string):Promise<Record<string, Response|string>>{
//         // try{
//             //get new access token using the stored refresh token and load the user
//             // const refreshRes = await getRefreshToken(clientId, refreshToken)
//             const refreshRes = await getRefreshToken(clientId, refreshToken)
            

//             if(refreshRes.ok){
//                 const tokens = await refreshRes.json()//If tokens are retrieved successfully, store them
//                 const access_token = tokens.access_token
//                 const refresh_token = tokens.refresh_token

//                 // const { access_token, refresh_token } = await refreshRes.json()//If tokens are retrieved successfully, store them

//                 console.log('Access token refreshed: ', access_token)
//                 const response = await fetch(endpoint, {
//         method: "GET", headers: { Authorization: `Bearer ${access_token}` }})
//                     if(response.ok){
//                         console.log("new access token returned data", response)
//                         return {'response' : response, "refresh_token": refresh_token, "access_token": access_token}

//                     }else{
//                         console.log("new access token failed to return data", response)
//                         return {'response' : response, "refresh_token": refresh_token, "access_token": access_token}

//                     }

//             }else{
//                 console.log('Failed to refresh access token')
//                 return {'response' : refreshRes, "refresh_token": refreshToken, "access_token": "undefined"}

//             }


// }

/** Directs user to authorize this app to connect with their spotify account */
// export async function redirectToAuthCodeFlow(clientId: string) {
//     const verifier = generateCodeVerifier(128);

//     const authLink = generateCodeChallenge(verifier).then((challenge)=>{
//         fetch("http://localhost:8080//set-cookie",{
//             headers: { "cookieName": "verifierKey", "cookieVal": `${verifier}` }
//             // body: "verifierKey:" + verifier
//         }
//         )
//         // storeData("verifier", verifier);
//         const params = new URLSearchParams();
//         params.append("client_id", clientId);
//         params.append("response_type", "code");
//         params.append("redirect_uri", "http://localhost:8080/callback");
//         params.append("scope", "user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-top-read user-library-read");
//         params.append("code_challenge_method", "S256");
//         params.append("code_challenge", challenge);
//         const newLink = `https://accounts.spotify.com/authorize?${params.toString()}`
//         return newLink

//     });
//     return authLink


// }

/** Send POST request to Spotify API authorize access and to retreive access token. */
export async function getAccessToken(code: string, verifier:string):Promise<Response> {
    const clientId = "002130106d174cc495fc8443cac019f2";

    // let verifier = getData("verifier");
    let params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:8080/callback");
    params.append("code_verifier", verifier!);

    //Grabs token after user verifies access
    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });
    console.log('response from getAccessToken:',res)
    return res

}

/** Send POST request to Spotify API to retrieve new tokens. Should only run if access token has expired. */
export async function getRefreshToken(clientId: string, refreshToken: string) : Promise<Response> {
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
    console.log( "response from getRefreshToken: ", res)

    return res

}


export function generateCodeVerifier(length: number) {
    let text = '';    
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export async function generateCodeChallenge(codeVerifier: string) {
    const hash = createHash('sha256').update(codeVerifier).digest('base64')

    return hash.replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

}