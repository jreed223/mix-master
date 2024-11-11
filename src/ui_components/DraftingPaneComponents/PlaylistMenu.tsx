import React from "react"
// import { Features, PlaylistItem } from "../../../server/types";
// import PlaylistClass from "../../models/playlistClass";
interface PlaylistMenuProps{

    setIsFullScreen: (value: React.SetStateAction<boolean>) => void
    isFullScreen: boolean
    setIsSeraching: (value: React.SetStateAction<boolean>) => void
    isSearching: boolean
    setDisplayFeatureMenu: (value: React.SetStateAction<boolean>) => void
    displayFeatureMenu: boolean
    setStagingState: (value: React.SetStateAction<string>) => void
    stagingState: string
    setDisabledDashboard: (value: React.SetStateAction<boolean>) => void
    disabledDashboard: boolean
    draftingPaneContainer: React.MutableRefObject<any>
    setActiveView: (value: React.SetStateAction<string[]>) => void



}
const PlaylistMenuBar:React.FC<PlaylistMenuProps>=(props: PlaylistMenuProps)=>{
    const closeCreationContainer = ()=>{
        props.setStagingState("closed")
        props.setIsFullScreen(false)

        if(!props.isSearching){
            props.setDisabledDashboard(false)
            props.setActiveView(["Dashboard"])
        }
        // console.log(stagingState)
        props.draftingPaneContainer.current.classList = "playlist-creation-container-hidden shrink-staging"
        // libraryContainer.current.classList = "library-container grow-library"

    }

    const toggleFullScreen = ()=>{
        if(!props.isFullScreen&&props.isSearching){
            props.setIsSeraching(false)
        }
        props.setIsFullScreen(prev=>!prev)

    }

    const toggleFeatures = ()=>{
        if(props.displayFeatureMenu===true){
            props.setDisplayFeatureMenu(false)
        }else{
            props.setDisplayFeatureMenu(true)
        }
    }



        return (
            <div className="playlist-creation-menu-bar" >
                <button onClick={()=>closeCreationContainer()}>Close</button>
                <button  onClick={()=>{toggleFeatures()}}>Audio Features</button>
                <button onClick={()=>toggleFullScreen()}>Full Screen</button>

            </div>
        )


    
}

export default PlaylistMenuBar