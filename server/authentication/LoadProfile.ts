

/** Fetches user using the current access token.
 * If the access token is expired, the user is fetched using a new access token generated by the refresh token. */
export async function fetchProfile(accessToken:string): Promise<Response> {
    const clientId = "002130106d174cc495fc8443cac019f2";

    // const refreshToken = getData("refresh_token");
    // const token = getData("access_token")

    // try{
    const res = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    })
    // if(res.ok){
    // console.log('response found fetching profile:', res)
    return res
        


    // }else{ //If unable to fetch profile (access token expired)
    //         // if(refreshToken && refreshToken !== 'undefined'){
    //         //     console.log('AccessToken expired: using refresh token to fetch user')
    //         //     const res = await fetch("http://localhost:8080/refresh-fetch", {
    //         //         method: "GET", headers: { endpoint: "https://api.spotify.com/v1/me" }
    //         //     })
    //         //     if(res.ok){
    //         //         return res
    //         //     }
    //         //         // userStateCB(user)                
    //         // }
    //         console.log('access token expired, no refresh token found')
    //         // userStateCB(null)
    //         return res
            
    //     }

// }catch(e){

//     console.log(e);
//     return null
// }
//     return null
}

