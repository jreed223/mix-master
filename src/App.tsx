//import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';
import {getAccessToken, getData} from './authentication/AuthHandler';
import {fetchProfile} from './authentication/LoadProfile';
import * as React from 'react';
import LoginPage from './ui_components/login';
import UserLibrary from './getData/library';



function App() {
    const clientId = "002130106d174cc495fc8443cac019f2";
    let token = getData("access_token");

    const [isLoading, setLoading] = useState(false);
    const [user, setUser] = useState<UserProfile|null>(null);


    /**Fetches user profile data from spotify and sets state of UserProfile Object*/
    async function loadUser(token){
      setLoading(true);
      try{
        await fetchProfile(token).then((newUser) => {
          if(newUser && newUser!==undefined){
            setUser(newUser)
            console.log(newUser)
          }
          setLoading(false)
        })
        }catch(e){
          console.log("Failed to load user : " + e); //current token is invalid and fetch profile failed to refresh tokens
          window.localStorage.clear();
          window.sessionStorage.clear();

        }
    }

    useEffect(()=>{
      let params = new URLSearchParams(window.location.search)
      let code : string = params.get("code");

      console.log("Use effect block running")
      //If a token is found in the browser storage try loading the user
      console.log(token);
      if(token && token !== 'undefined'){
        console.log("loading user from saved token")
        loadUser(token)
      }

      //if the browser storage has the authorizing key with a value of true, retrieve the access token and load user
      if(window.localStorage.getItem('authorizing')==='true'){
        getAccessToken(clientId, code).then((token)=>{
          console.log("retrieving user using token" + {token})
          loadUser(token);
        })

      window.localStorage.removeItem('authorizing');
    }

  }, [token]); //Anytime the token is changed the use effect block will run

    if(isLoading){
      return(
        <div><h1>Loading...</h1></div>
      )
    }else if(user){
      return(<div>
        <h1>Welcome {user.display_name}, {user.id}!</h1>
        <UserLibrary accessToken={token}></UserLibrary>
      </div>)
    }else{
      return <LoginPage></LoginPage>
          }

}

export default App;


