/** Stores data either in local storage or session storage based on user preferences */
// export function storeData(key : string, value : string){
//     if(localStorage.getItem("save_user")==="true"){
//         localStorage.setItem(key, value);
//     }else{
//         sessionStorage.setItem(key, value);
//     }
// }



export async function refreshTokensThenFetch(clientId:string, refreshToken:string, endpoint:string){
        try{
            //get new access token using the stored refresh token and load the user
            await getRefreshToken(clientId, refreshToken).then(async (newAccessToken)=>{

                if(newAccessToken){
                    console.log('New access token fetched')
                    await fetch(endpoint, {
        method: "GET", headers: { Authorization: `Bearer ${newAccessToken}` }}).then(async (result)=>{
            if(result.ok){
                console.log("new access token returned data", result)
                const resultObject = await result.json();
                console.log("resultObject", resultObject)
                return resultObject;

            }else{
                // localStorage.clear();
                // sessionStorage.clear();
                // return null

            }

        });

        }})

        }catch(e){
            console.log(e)
            // localStorage.clear();
            // sessionStorage.clear();
            return null
        }


}

/** Directs user to authorize this app to connect with their spotify account */
export async function redirectToAuthCodeFlow(clientId: string) {
    const verifier = generateCodeVerifier(128);

    await generateCodeChallenge(verifier).then((challenge)=>{
        fetch("/set-cookie",{
            body: "verifierKey:" + verifier
        }
        )
        // storeData("verifier", verifier);
        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("response_type", "code");
        params.append("redirect_uri", "http://localhost:8080/callback");
        params.append("scope", "user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-top-read user-library-read");
        params.append("code_challenge_method", "S256");
        params.append("code_challenge", challenge);
        document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;

    });

}

/** Send POST request to Spotify API authorize access and to retreive access token. */
export async function getAccessToken(code: string, verifier:string):Promise<Record<string, string>|null> {
    const clientId = "002130106d174cc495fc8443cac019f2";

    // let verifier = getData("verifier");
    let params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:8080/callback");
    params.append("code_verifier", verifier!);

    //Grabs token after user verifies access
    try{
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });
    const { access_token, refresh_token } = await result.json(); //Stores token if valid response is recieved
    if((access_token && access_token!=="undefined")&&(refresh_token && refresh_token !== "undefined")){
        console.log("User verified successfully. Tokens stored");

        // storeData("refresh_token", refresh_token);
        // storeData("access_token", access_token);
        const tokens = {"access_token": access_token, "refresh_token": refresh_token}
        return tokens;

    }
}catch(e){
    console.log("authorization code not accepted. Failed to retrieve access token : " + e);
    return null
}
    return null
}

/** Send POST request to Spotify API to retrieve new tokens. Should only run if access token has expired. */
export async function getRefreshToken(clientId: string, refreshToken: string) : Promise<Record<string, string>|null> {
    console.log("refreshing tokens")
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("refresh_token", refreshToken);
    params.append("grant_type", "refresh_token");

try{
    //Grabs token after account has been verified
    const newTokens = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token, refresh_token } = await newTokens.json()//If tokens are retrieved successfully, store them
    console.log(access_token, refresh_token)
    if((access_token && access_token!=="undefined")&&(refresh_token && refresh_token !== "undefined"))
        console.log("Tokens successfully refreshed");

    const tokens = {"access_token": access_token, "refresh_token": refresh_token}

        return tokens;
}catch(e){
    console.log("Failed to refresh tokens : " + e);
    // localStorage.clear();
    // sessionStorage.clear();
}
return null
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