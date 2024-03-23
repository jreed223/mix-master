import { fetchProfile } from "./LoadProfile";

// **directs user to spotify to authenticate and authorize access
export async function authorizeUser(){
    const clientId = "002130106d174cc495fc8443cac019f2";
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    
if(!code){
        redirectToAuthCodeFlow(clientId);
    }else{
            const accessToken = await getAccessToken(clientId, code)

            return accessToken;
    }
}

export function loginUser(){
    let accessToken = window.localStorage.getItem("access_token");
    const clientId = "002130106d174cc495fc8443cac019f2";

    if(accessToken){
        try{
            let currentUser = fetchProfile(accessToken);
            return currentUser;
        }catch(e){
            window.localStorage.clear();
            console.log(e)
        }
    }else{
        redirectToAuthCodeFlow(clientId);
    }
}

export async function redirectToAuthCodeFlow(clientId: string) {
    const verifier = generateCodeVerifier(128);

    await generateCodeChallenge(verifier).then((challenge)=>{
        window.localStorage.setItem("verifier", verifier);
        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("response_type", "code");
        params.append("redirect_uri", "http://localhost:3000/callback");
        params.append("scope", "user-read-private user-read-email");
        params.append("code_challenge_method", "S256");
        params.append("code_challenge", challenge);
        document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;

    });

    
    
}

/** Send POST request to Spotify API to retreive access token */
export async function getAccessToken(clientId: string, code: string):Promise<string> {
    const verifier = window.localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:3000/callback");
    params.append("code_verifier", verifier!);

    //Grabs token after account has been verified
    try{
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });
    console.log(result);

    if(result.ok){
        const { access_token, refresh_token } = await result.json();
        window.localStorage.setItem("refresh_token", refresh_token);
        window.localStorage.setItem("access_token", access_token);
        return access_token;

    }
}catch(e){
    return(e + "authorization code not accepted");
}

}

/** Send POST request to Spotify API to retrieve refresh token */
export async function getRefreshToken(refreshToken: string) : Promise<string> {


    const params = new URLSearchParams();
        params.append("refresh_token", refreshToken);
        params.append("grant_type", "refresh_token");
        params.append("redirect_uri", "http://localhost:3000/callback");


    //Grabs token after account has been verified
    const tokens = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token, refresh_token } = await tokens.json();
    window.localStorage.setItem('access_token', access_token);
    window.localStorage.setItem('refresh_token', refresh_token);

    return access_token;
}

function generateCodeVerifier(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}