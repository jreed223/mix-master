import React, { ReactElement, useCallback, useContext, useEffect, useState } from "react"
import { ViewContext } from "../../../state_management/ViewProvider.tsx"
import { DraftingContext } from "../../../state_management/DraftingPaneProvider.tsx"
import type { Album, Artist, Playlist, SearchResults, UserProfile } from '../../../../server/types.d.ts';
// import { Features, PlaylistItem } from "../../../server/types";
// import PlaylistClass from "../../models/playlistClass";
import { userProfile } from '../../../../server/SpotifyData/controllers/userControllers/currentUser.ts';
import ResultCard, { ResultCardProps } from "./ResultCard.tsx";
import { playlists } from '../../../../server/SpotifyData/controllers/libraryControllers/playlists.ts';
import openSpotify from "../../OpenSpotifyButton.tsx";
export type ArtistProfileProps = {
    type: 'artist'
    profileId:string
    profile?:Artist

}

export type UserProfileProps = {
    type: 'user'
    profileId:string
    profile?:UserProfile

}

interface ProfileViewProps {

type:'artist'|'user'
profileId:string;
profile?:Artist|UserProfile



}
const ProfileView: React.FC<ProfileViewProps> = (props: ProfileViewProps) => {
    const artistProps = props as ArtistProfileProps
    const userProps = props as UserProfileProps
    // const [fullProfile, setFullProfile] = useState<UserProfile|Artist>(null)
    const [currentContentCards, setCurrentContentCards] = useState<ReactElement<ResultCardProps>[]>(null)

    const [currentContentList, setCurrentContentList] = useState<Album['album'][]|Playlist[]>(null)
    const [currentProfileCard, setCurrentProfileCard] = useState< React.JSX.Element>(null)

    const {  isMobile, setDisplayProfile, setSelectedProfile, displayProfile  } = useContext(ViewContext)
    const { displayFilterMenu, setStagingState, setDisplayFilterMenu, stagingState, displayTracks } = useContext(DraftingContext)

    const  fetchFullArtist = useCallback(async ()=>{
        if(props.type==="artist"){

            const artistObject: Artist = await fetch("/spotify-data/artist", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: artistProps.profileId })
                // headers: {"id" : `${this.id}` }
            }).then(async (res) => {
                const artist = await res.json()
                return artist
            })

            console.log(artistObject)
            // setFullProfile(artistObject)
            return artistObject

        }
    },[artistProps?.profileId, props?.type])
    
    const fetchAlbums = useCallback(async () => {

            const albumsObject: SearchResults['albums'] = await fetch("/spotify-data/artistAlbums", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: artistProps.profileId })
                // headers: {"id" : `${this.id}` }
            }).then(async (res) => {
                const albums = await res.json()
                return albums
            })

            console.log(albumsObject)
            setCurrentContentList(albumsObject.items)

    }, [artistProps?.profileId])

    const  fetchFullUser = useCallback(async ()=>{
        if(props.type==='user'){

            const userObject: UserProfile = await fetch("/spotify-data/user", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: userProps.profileId })
                // headers: {"id" : `${this.id}` }
            }).then(async (res) => {
                const user = await res.json()
                return user
            })

            console.log(userObject)
            return userObject
            // setCurrentContent(userObject)

        }
    }, [props?.type, userProps?.profileId])
        
    const fetchPlaylists = useCallback(async () => {

            const playlists: SearchResults['playlists'] = await fetch("/spotify-data/users-playlists", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: userProps.profileId })

            }).then(async (res) => {
                const playlists = await res.json()
                return playlists
            })

            console.log(playlists)
            setCurrentContentList(playlists.items)

    }, [userProps?.profileId])


    const profileCard = useCallback((fullProfile: Artist|UserProfile)=>(
        <div style={{  display: "flex", margin: 0, padding: "9px", height: isMobile?"8vh":"12vh",  minHeight:isMobile?'unset':'80px'}} className="track-card">
        <div style={{  display: "inline", position: "relative", height: "100%", aspectRatio: "1 / 1" }}>
            <img loading="lazy" style={{ borderRadius: "50%", position: "relative", height: "100%", aspectRatio: "1 / 1" }} src={props.type==='artist'?(fullProfile as Artist).images?.at(0)?.url||"default-artist-img.png":props.type==='user'?(fullProfile as UserProfile).images?.at(0)?.url||"default-artist-img.png":"default-artist-img.png"} alt={`${props.type==='artist'?(fullProfile as Artist).name.at(0):props.type==='user'?(fullProfile as UserProfile).display_name:"Unknown"} cover`}></img>
            <div  style={{ top: 0, left: 0, width: "100%", height: "100%", position: "absolute" }}></div>
        </div>
            <p style={{ display: 'inline', margin:'auto 7px' }} className={"track-card-text "}>{props.type==='artist'?(fullProfile as Artist).name:props.type==='user'?(fullProfile as UserProfile).display_name:"Unknown"}</p>
            <div style={{flex: 1, display: 'flex', alignItems:'center', justifyContent:'space-evenly', margin: 'auto 15px'}}>
                {openSpotify((props.type==='artist'?(fullProfile as Artist).uri:(fullProfile as UserProfile).uri))}

            <button onClick={(e) => {e.preventDefault();setDisplayProfile(false)}} style={{ minWidth: "10%", height: "30px", borderRadius: "25px",  }}>Close</button>
        </div>
    </div>

    ), [isMobile, props.type, setDisplayProfile])

    useEffect(()=>{
        if(props.type==="artist"){
            if(props.profile){

                setCurrentProfileCard(profileCard(props.profile))
                fetchAlbums()

    
            }else{
                
            fetchFullArtist().then((fullProfile: Artist)=>{
                setCurrentProfileCard(profileCard(fullProfile))
                fetchAlbums()
            })
            }


        }else if(props.type==="user"){
            if(props.profile){

                setCurrentProfileCard(profileCard(props.profile))
                fetchPlaylists()
            }else{
                fetchFullUser().then((fullProfile: UserProfile)=>{
                    setCurrentProfileCard(profileCard(fullProfile))
                    fetchPlaylists()
                })
            }
        }
    }, [fetchAlbums, fetchFullArtist, fetchFullUser, fetchPlaylists, profileCard, props, props.profile, props.type])

    useEffect(()=>{
        if(currentContentList){
            setCurrentContentCards(
                currentContentList.map((item, idx)=>{
                    return <ResultCard
                    key={idx}
                                popularity={null}
                                result={{
                                    type: props.type==="artist"?"album":"playlist",
                                    item: item,
                                    displayTracks: displayTracks
                                }}></ResultCard>
                })
            )
        }
    }, [currentContentList, displayTracks, setDisplayProfile, setSelectedProfile, props.type])




    return (
        <div style={{height:"calc(100vh - 50px)",background: "#141414", transition: '1s', width: isMobile?"100%":stagingState==="open"?"calc(50%)":"calc(75%)", position:'fixed', overflowY: 'hidden', display:displayProfile?"flex":"none", flexDirection:'column', zIndex:999 }}>
        
        {currentProfileCard?currentProfileCard:<></>}

        <div style={{ alignContent:'baseline', flexFlow:"row wrap", display: "flex", width:"100%", flex:'1' ,   background: "rgb(33 33 33)", overflowY:'auto', transition:"1s" }}>
       {currentContentCards?currentContentCards:<></>}
        </div>

    </div>
    )



}

export default ProfileView