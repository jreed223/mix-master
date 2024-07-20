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
   

    const [user, setUser] = useState<UserProfile|null>(null);
    //const [token, setToken] = useState<String|null>(null);
    //setToken(getData("access_token"));

    /**Fetches user profile data from spotify and sets state of UserProfile Object*/
    async function loadUser(token){
      try{
        await fetchProfile(token, setUser)

        }catch(e){
          console.log("Failed to load user : " + e); //current token is invalid and fetch profile failed to refresh tokens
          window.localStorage.clear();
          window.sessionStorage.clear();
          //setToken(null);
        }
    }

    useEffect(()=>{
      let params = new URLSearchParams(window.location.search)
      let code : string = params.get("code");

      console.log("Use effect block running")
        console.log("attempting to load user")
      fetch("/spotify-data/user").then(async user=>{
        setUser(await user.json())
        setLoading(false)
      }).catch(()=>{
        setUser(null)
        setLoading(false)
      }) //fetch and set user

      //if the browser storage has the authorizing key with a value of true, retrieve the access token and load user
      if(window.localStorage.getItem('authorizing')==='true'){
        setLoading(true)
        fetch("/spotify-data/init-login").then(()=>{
                window.localStorage.removeItem('authorizing');
                setLoading(false)

        })
      }

  }, [token]); //Anytime the token is changed the use effect block will run


  
  if(isLoading === true){   //If authorizing user, direct to loading screen until user is set
    return(
      <div><h1>Loading...</h1></div>
    )
  }else if(user){
    return(<div>
      <NavBar currentUser={user} token={token}></NavBar>
    </div>)
  }else{ //If no user found and not authorizing user
    return <LoginPage></LoginPage>
        }


}

export default App;

