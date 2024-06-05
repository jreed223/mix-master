import { UserProfile } from "@spotify/web-api-ts-sdk";
import {refreshTokensThenFetch } from "./AuthHandler";


/** Fetches user using the current access token.
 * If the access token is expired, the user is fetched using a new access token generated by the refresh token. */
export async function fetchProfile(accessToken:string, refreshToken:string): Promise<UserProfile | null> {
    const clientId = "002130106d174cc495fc8443cac019f2";

    // const refreshToken = getData("refresh_token");
    // const token = getData("access_token")

    try{
    const res = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    })
    if(res.ok){
        console.log('response found fetching profile:', res)
        const user = await res.json()
        return user
        


    }else{ //If unable to fetch profile (access token expired)
            if(refreshToken && refreshToken !== 'undefined'){
                console.log('AccessToken expired: using refresh token to fetch user')
                const res = await refreshTokensThenFetch(clientId, refreshToken, "https://api.spotify.com/v1/me")
                if(res){
                    const user = await res.json()
                    console.log("fetched user after token refreshed:", user)
                    return user
                }
                    // userStateCB(user)                
            }else{
                console.log('access token expired, no refresh token found')
                // userStateCB(null)
                return null
            }
        }

}catch(e){

    console.log(e);
    return null
}
    return null
}

