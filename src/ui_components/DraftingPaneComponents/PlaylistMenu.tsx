import React, { useContext, useEffect } from "react"
import { NavigationContext } from "../../state_management/NavigationProvider"
import { DraftingContext } from "../../state_management/DraftingPaneProvider"
// import { Features, PlaylistItem } from "../../../server/types";
// import PlaylistClass from "../../models/playlistClass";
interface PlaylistMenuProps {


    draftingPaneContainer: React.MutableRefObject<any>



}
const PlaylistMenuBar: React.FC<PlaylistMenuProps> = (props: PlaylistMenuProps) => {
    const {  setStagingState, isMobile, isMaxDraftView, setIsMaxDraftView } = useContext(NavigationContext)
    const { displayFeatureMenu, setDisplayFeatureMenu } = useContext(DraftingContext)

    const closeCreationContainer = () => {
        setStagingState("closed")
        setIsMaxDraftView(false)

  
        // console.log(stagingState)
        props.draftingPaneContainer.current.classList = "playlist-creation-container-hidden shrink-staging"
        // libraryContainer.current.classList = "library-container grow-library"

    }

    const toggleFullScreen = () => {
        setIsMaxDraftView(prev => !prev)
    }

    const toggleFeatures = () => {
        setDisplayFeatureMenu(prev => !prev)
    }

    useEffect(()=>{
        if(isMobile){
            setIsMaxDraftView(false)
        }
    },[isMobile, setIsMaxDraftView])



    return (
        <div className="playlist-creation-menu-bar" >
            <button className='draft-pane-button' onClick={() => closeCreationContainer()}>Close</button>
            <button className='draft-pane-button' onClick={() => { toggleFeatures() }}>Audio Features</button>
            <button disabled={isMobile} className='draft-pane-button' style={{opacity:isMobile?0:1, transition:'1s'}} onClick={() => toggleFullScreen()}>Full Screen</button>

        </div>
    )



}

export default PlaylistMenuBar