//import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';
import * as React from 'react';
import LoginPage from './ui_components/LoginPage';

import NavBar from './ui_components/NavBar';



function App() {
    //const clientId = "002130106d174cc495fc8443cac019f2";
   

    const [user, setUser] = useState<UserProfile|null>(null);
    const [isLoading, setLoading] = useState<boolean>(true)

    useEffect(()=>{
      console.log("Use effect block running")
        console.log("attempting to load user")
      fetch("/spotify-data/user").then(async user=>{
        setUser(await user.json())
      }) //fetch and set user

      //if the browser storage has the authorizing key with a value of true, redirect to authorization
      if(window.localStorage.getItem('authorizing')==='true'){
        fetch("/spotify-data/init-login").then(()=>{
                window.localStorage.removeItem('authorizing');
        })
    }
    setLoading(false)


  }, []);


  //If a user is set display user info
  if(user){
    return(<div>
      <NavBar currentUser={user}></NavBar>
    </div>)
  }else if(isLoading === true){   //If authorizing user, direct to loading screen until user is set
    return(
      <div><h1>Loading...</h1></div>
    )
  }else{ //If no user found and not authorizing user
    return <LoginPage></LoginPage>
        }


}

export default App;


