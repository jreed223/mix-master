import { Request as expressRequest, Response as expressResponse} from 'express';
type FetchResponse = Response;  //Fetch API Response

export async function getAccessToken(code: string, verifier:string):Promise<FetchResponse> {
    const clientId = process.env.CLIENT_ID||"";

    // let verifier = getData("verifier");
    let params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", process.env.REDIRECT_URI||"http://localhost:8080/callback");
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


export const callback = (req: expressRequest, res: expressResponse)=>{
    const code = req.query.code?req.query.code as string: null;
    const verifier = req.cookies.verifierKey;
    res.clearCookie('verifierKey')

    if(code&&verifier){
        getAccessToken(code, verifier).then(async (response)=>{
            if(response.ok){
                console.log("OK response from /callback")
                const tokens  = await response.json()//If tokens are retrieved successfully, store them
                const expiration = new Date(Date.now()+tokens.expires_in*1000)

                res.cookie("access_token", tokens.access_token, {maxAge:tokens.expires_in*1000})
                res.cookie("refresh_token", tokens.refresh_token, {maxAge:2592000*1000})
                res.cookie("expires",expiration, {maxAge:tokens.expires_in*1000})

                res.redirect("/")

            }else{
                const error = await response.json()
                console.error("Failed to retrieve access token (/callback):", error)
            }

        }).catch((e)=>{

            console.error("Fetch operation failed (/callback):", e)
        })
    }else{
        console.error("Code||Verifier not found (callback)")
    }

}