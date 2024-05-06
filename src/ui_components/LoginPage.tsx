import React from "react"
import { redirectToAuthCodeFlow } from "../authentication/AuthHandler";

function intialLogin (){

    const clientId = "002130106d174cc495fc8443cac019f2";
    console.log("Authorizing the Application")
    window.localStorage.setItem('authorizing', 'true'); //removed from storage once the user is loaded and authorized
    redirectToAuthCodeFlow(clientId);
}

export default function LoginPage(){
    return(
        <div className="App">
            <header className="App-header">
                <p>MixMaster: Playlist Builder</p>
                <button className="login-button" onClick={() => {fetch("/spotify-data/authentication-flow")}}>Login</button>
                <p><input type="checkbox" id="save-sign-in"
                onChange={(e)=>{e.target.checked?window.localStorage.setItem('save_user', 'true'):window.localStorage.removeItem('save_user')}}>
                    </input>Stay signed in?</p>
            </header>
        </div>
    )
};