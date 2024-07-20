
import { createHash } from "crypto";


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
    // console.log( "response from getRefreshToken: ", res)

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