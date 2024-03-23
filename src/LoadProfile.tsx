import { ReactElement, useEffect, useState } from "react";
import { getRefreshToken, redirectToAuthCodeFlow } from "./AuthHandler";
import * as React from "react";

export async function fetchProfile(token: string): Promise<UserProfile | null> {
    // let result: any;
    // const clientId = "002130106d174cc495fc8443cac019f2";
    const refreshToken = window.localStorage.getItem('refresh_token');

    try{
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    if(!result.ok){
        if(refreshToken){
        try{

            await getRefreshToken(refreshToken).then(async (newAccessToken)=>{

                if(newAccessToken){
                    const refreshedProfile = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${newAccessToken}` }});
            
        if(!refreshedProfile){
                window.localStorage.clear();
            }else{
                const user: UserProfile = await refreshedProfile.json();
                console.log(user)
                return user
            }

        }})

        }catch(e){
            console.log(e)
            window.localStorage.clear();
        }
    }
    }

    const user: UserProfile = await result.json();
    return user
}catch(e){
    
    console.log(e);

}

}

export function Profile(token : string) : ReactElement{
    const [user, setUser] = useState<UserProfile|null>(null) ;

    useEffect(()=>{
        fetchProfile(token).then(res => setUser(res))
    }, [token]);
    if(!user){
        throw new Error(
            "Unable to sync User. Try again."
        )
    }else{
        return(<>
        {user?<h1>{user.display_name}</h1>:<></>}</>)
    }
}