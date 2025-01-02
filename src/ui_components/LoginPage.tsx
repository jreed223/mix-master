import React from "react"
// import { redirectToAuthCodeFlow } from "../authentication/AuthHandler";

// function intialLogin (){

//     const clientId = "002130106d174cc495fc8443cac019f2";
//     console.log("Authorizing the Application")
//     window.localStorage.setItem('authorizing', 'true'); //removed from storage once the user is loaded and authorized
//     redirectToAuthCodeFlow(clientId);
// }
const handleSaveUser = (e:React.ChangeEvent<HTMLInputElement>)=>{
    if(e.target.checked){
        document.cookie = `save_user=true;max-age=${2592000*1000}` //30 days in miliseconds
    }else{
        document.cookie = 'save_user=false;'
    }
}

export default function LoginPage(){
    return(
        <div className="App">
            <header className="App-header">
                <p>MixMaster: Playlist Builder</p>
                <button className="login-button" onClick={() => {
                    fetch("/spotify-data/authentication-flow").then(async (res)=>{
                    const authLink = await res.text()
                    window.location.href = authLink
                    return authLink
                    })}}>Login</button>
                <p><input type="checkbox" id="save-sign-in"
                onChange={(e)=>handleSaveUser(e)}>
                    </input>Stay signed in?</p>
            </header>
        </div>
    )
};