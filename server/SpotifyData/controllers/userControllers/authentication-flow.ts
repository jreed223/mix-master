import { Request as expressRequest, Response as expressResponse} from 'express';
import {createHash} from "crypto";
type FetchResponse = Response;  //Fetch API Response

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


export const authLink = async (req: expressRequest, res: expressResponse)=>{
    const clientId = process.env.CLIENT_ID||"";

    //console.log("Authorizing the Application");
    // res.cookie('authorizing', 'true');
        const verifier = generateCodeVerifier(128);

    const authLink = await generateCodeChallenge(verifier).then((challenge:string)=>{
        res.cookie("verifierKey", verifier)

        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("response_type", "code");
        params.append("redirect_uri", "https://mix-master-fg4z.onrender.com/callback");
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
}