export async function fetchAlbums(accessToken:string): Promise<Response> {
    const clientId = "002130106d174cc495fc8443cac019f2";
    // const token = getData("token")
    // const refreshToken = getData("refresh_token");

try{
    
    const res = await fetch("https://api.spotify.com/v1/me/albums", {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });
    //console.log(res.headers)
    return res;

}catch(e){

    console.error("Error in fetchAlbums(): ", e)
    return(Response.error())
}
    

}