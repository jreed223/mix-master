import { UserProfile } from "@spotify/web-api-ts-sdk";
import { getData, refreshTokensThenFetch } from "./AuthHandler";


/** Fetches user using the current access token.
 * If the access token is expired, the user is fetched using a new access token generated by the refresh token. */
export async function fetchProfile(token: string, userStateCB): Promise<UserProfile | null> {
    const clientId = "002130106d174cc495fc8443cac019f2";

    const refreshToken = getData("refresh_token");


    try{
    await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    }).then(async (result)=>{
        if(result.ok){
            console.log('response found fetching profile:', result)
            await result.json().then((user : UserProfile)=>{
                console.log("fetched user:", user)
                userStateCB(user);
                return user
            });

        }else{ //If unable to fetch profile (access token expired)
            if(refreshToken && refreshToken !== 'undefined'){
                console.log('AccessToken expired: using refresh token to fetch user')
                await refreshTokensThenFetch(clientId, refreshToken, "https://api.spotify.com/v1/me").then((user:UserProfile)=>{
                    console.log("fetched user after token refreshed:", user)
                    userStateCB(user)
                    return user;
                })
            }else{
                console.log('access token expired, no refresh token found')
                userStateCB(null)
                return null
            }
        }
    });

}catch(e){

    console.log(e);
    return null
}

}

