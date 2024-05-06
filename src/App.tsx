//import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';
import {getAccessToken, getData} from './authentication/AuthHandler';
import {fetchProfile} from './authentication/LoadProfile';
import * as React from 'react';
import LoginPage from './ui_components/LoginPage';

import NavBar from './ui_components/NavBar';
import UserLibrary from './ui_components/UserLibrary';



function App() {
    const clientId = "002130106d174cc495fc8443cac019f2";
    let token = null

    //const [isLoading, setLoading] = useState(false);
    const [user, setUser] = useState<UserProfile|null>(null);
    //const [token, setToken] = useState<String|null>(null);
    //setToken(getData("access_token"));

    /**Fetches user profile data from spotify and sets state of UserProfile Object*/
    // async function loadUser(token){
  
    //   try{
    //     await fetchProfile(token, setUser)

    //     }catch(e){
    //       console.log("Failed to load user : " + e); //current token is invalid and fetch profile failed to refresh tokens
    //       window.localStorage.clear();
    //       window.sessionStorage.clear();
    //       //setToken(null);
    //     }
    // }

    useEffect(()=>{
      // let params = new URLSearchParams(window.location.search)
      // let code : string = params.get("code");

      console.log("Use effect block running")
      //If a token is found in the browser storage try loading the user
      if((token && (token !== 'undefined'||null))){
        console.log("loading user from saved token")
        fetch("/spotify-api/user",{
        }).then(res=>res.json())
        .then(newUser=>setUser(newUser))
      }

      //if the browser storage has the authorizing key with a value of true, retrieve the access token and load user
      if(window.localStorage.getItem('authorizing')==='true'){
        fetch("/spotify-data/init-login")
        .then( res=>
          res.json()
        ).then((newUser)=>setUser(newUser))

      // window.localStorage.removeItem('authorizing');
    }

  }, [token]); //Anytime the token is changed the use effect block will run


  console.log(token);
  //If a user is set display user info
  if(user){
    return(<div>
      <NavBar currentUser={user} token={token}></NavBar>
    </div>)
  }else if(token && token !== 'undefined'){   //If a token is found in the browser storage, direct to loading screen until user is set
    return(
      <div><h1>Loading...</h1></div>
    )
  }else{ //If no token or user found, direct to authetentication flow
    return <LoginPage></LoginPage>
        }


}

export default App;


