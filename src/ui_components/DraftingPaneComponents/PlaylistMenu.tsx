import React, { useContext } from "react"
import { NavigationContext } from "../../state_management/NavigationProvider"
import { DraftingContext } from "../../state_management/DraftingPaneProvider"
// import { Features, PlaylistItem } from "../../../server/types";
// import PlaylistClass from "../../models/playlistClass";
interface PlaylistMenuProps {


    draftingPaneContainer: React.MutableRefObject<any>



}
const PlaylistMenuBar: React.FC<PlaylistMenuProps> = (props: PlaylistMenuProps) => {
    const { setActiveView, isSearching, setIsSearching, setStagingState } = useContext(NavigationContext)
    const {isMaxDraftView, setIsMaxDraftView, displayFeatureMenu, setDisplayFeatureMenu } = useContext(DraftingContext)

    const closeCreationContainer = () => {
        setStagingState("closed")
        setIsMaxDraftView(false)

        if (!isSearching) {
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



    return (
        <div className="playlist-creation-menu-bar" >
            <button className='draft-pane-button' onClick={() => closeCreationContainer()}>Close</button>
            <button className='draft-pane-button' onClick={() => { toggleFeatures() }}>Audio Features</button>
            <button className='draft-pane-button' onClick={() => toggleFullScreen()}>Full Screen</button>

        </div>
    )



}

export default PlaylistMenuBar