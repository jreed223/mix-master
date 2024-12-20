//import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';
import * as React from 'react';
import LoginPage from './ui_components/LoginPage';

import NavBar from './ui_components/NavBar';
import { UserProfile } from '../server/types';
import NavigationProvider from './state_management/NavigationProvider';



function App() {
   

    const [currentUser, setCurrentUser] = useState<UserProfile|null>(null);
    const [isLoading, setLoading] = useState<boolean>(true)

    useEffect(()=>{
      // console.log("Use effect block running")
        console.log("attempting to load user")
      fetch("/spotify-data/user").then(async user=>{
        setCurrentUser(await user.json())
        setLoading(false)
      }).catch(()=>{
        setCurrentUser(null)
        setLoading(false)
      }) //fetch and set user

      //if the browser storage has the authorizing key with a value of true, redirect to authorization
      if(window.localStorage.getItem('authorizing')==='true'){
        setLoading(true)
        fetch("/spotify-data/init-login").then(()=>{
                window.localStorage.removeItem('authorizing');
                setLoading(false)

        })
      }

  }, []);


  
  if(isLoading === true){   //If authorizing user, direct to loading screen until user is set
    return(
      <div><h1>Loading Profile...</h1></div>
    )
  }else if(currentUser){
    return(
    <NavigationProvider>
      <div>
        <NavBar currentUser={currentUser}></NavBar>
      </div>
    </NavigationProvider>)
  }else{ //If no user found and not authorizing user
    return <LoginPage></LoginPage>
        }


}

export default App;

