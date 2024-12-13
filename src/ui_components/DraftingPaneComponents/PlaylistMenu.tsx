import React, { useContext, useEffect } from "react"
import { NavigationContext } from "../../state_management/NavigationProvider"
import { DraftingContext } from "../../state_management/DraftingPaneProvider"
// import { Features, PlaylistItem } from "../../../server/types";
// import PlaylistClass from "../../models/playlistClass";
interface PlaylistMenuProps {


    draftingPaneContainer: React.MutableRefObject<any>



}
const PlaylistMenuBar: React.FC<PlaylistMenuProps> = (props: PlaylistMenuProps) => {
    const { setActiveView, isSearching, setIsSearching, setStagingState, isMobile } = useContext(NavigationContext)
    const {isMaxDraftView, setIsMaxDraftView, displayFeatureMenu, setDisplayFeatureMenu } = useContext(DraftingContext)

    const closeCreationContainer = () => {
        setStagingState("closed")
        setIsMaxDraftView(false)

        if (!isSearching && !isMobile) {
            setActiveView(["Dashboard"])
        }
        // console.log(stagingState)
        props.draftingPaneContainer.current.classList = "playlist-creation-container-hidden shrink-staging"
        // libraryContainer.current.classList = "library-container grow-library"

    }

    const toggleFullScreen = () => {
        if (!isMaxDraftView && isSearching) {
            setIsSearching(false)
        }
        setIsMaxDraftView(prev => !prev)

    }

    const toggleFeatures = () => {
        if (displayFeatureMenu === true) {
            setDisplayFeatureMenu(false)
        } else {
            setDisplayFeatureMenu(true)
        }
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