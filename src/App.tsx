//import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';
import { getAccessToken, getRefreshToken, redirectToAuthCodeFlow } from './AuthHandler';
import { fetchProfile, Profile } from './LoadProfile';
import * as React from 'react';



function App() {
  // var accessToken = window.localStorage.getItem("access_token");
  // const refreshToken = localStorage.getItem('refresh_token');
    const clientId = "002130106d174cc495fc8443cac019f2";
    // const currentUser : UserProfile;
    // const authorizing = window.localStorage.getItem("authorizing");
    // var accessToken = window.localStorage.getItem('access_token');

    let params = new URLSearchParams(window.location.search)
    let code : string = params.get("code");
 
    const [isLoading, setLoading] = useState(false);
    // const [isAuthorizing, setAuthorizing] = useState<boolean>(authorizing==='true');
    const [user, setUser] = useState<UserProfile|null>(null);
    // let user: UserProfile | null;
    // const userPromise = ;
    

    // if(isAuthorizing === 'true'){
    //   const params = new URLSearchParams(window.location.search)
    //   const code : string | null = params.get("code");
    //   setLoading(true);
    //   getAccessToken(clientId, code).then((token)=>{
    //   fetchProfile(token).then((newUser) => {
    //     if(newUser){
    //       setUser(newUser)
    //     }})
    //       setLoading(false);
    //   })
    // }
    
    function intialLogin (){
      console.log("getting access token")
      window.localStorage.setItem('authorizing', 'true');
      redirectToAuthCodeFlow(clientId);
    }
    
    async function loadUser(token){
      setLoading(true);
      try{

        await fetchProfile(token).then((newUser) => {
          if(newUser){
            setUser(newUser)
            console.log(newUser)
        }
          setLoading(false)
    })

        }catch(e){
          console.log(e+"::loadUser");
        }

    }

    useEffect(()=>{

      let token = window.localStorage.getItem('access_token')

      if(token){
        console.log("loading user from saved token")
        window.localStorage.removeItem('authorizing');
        loadUser(token)

      }
      if(window.localStorage.getItem('authorizing')==='true'){
        getAccessToken(clientId, code).then((token)=>{
          console.log("retrieving user using token" + {token})
          loadUser(token);
        })
        window.localStorage.removeItem('authorizing');
      }


  }, [code]);

    if(isLoading){
      return(
        <div><h1>Loading...</h1></div>
      )
    }else if(user){
      return(<div><h1>{user.display_name}</h1></div>)
    }else{
      return (
              <div className="App">
                <header className="App-header">
                  <p>
                    MixMaster: Playlist Builder
                  </p>
                  <button onClick={() => {intialLogin()}}>Login</button>
                </header>
              </div>
            );
          }

}

export default App;


