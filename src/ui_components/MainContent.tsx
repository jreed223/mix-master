import { useContext, useEffect, useMemo, useState, } from "react";
import React from "react";
import { UserProfile } from '../../server/types';

import DraftingArea from "./DraftingPaneComponents/DraftingPane";
// import { LibraryComponents } from "./UserLibrary/LibraryComponents";
import { NavigationContext } from "../state_management/NavigationProvider";
import DraftingProvider from "../state_management/DraftingPaneProvider";
// import SearchBar from "./SearchPane/SearchBar";
import { submissionStatusState } from "./DraftingPaneComponents/Playlists/DraftPlaylistArea";
import { LibrarySelectionPane } from "./LibrarySelectionPane";



interface UserLibraryProps {
    currentUser: UserProfile
}

export default function MainContent(props: UserLibraryProps) {

    const {setStagingState, setUser} = useContext(NavigationContext)
    const [reloadKey, setReloadKey] = useState<number>(0)
    const [dialogText, setDialogText]=useState<submissionStatusState>(null)

    useEffect(()=>{
        if(props.currentUser){
            setUser(props.currentUser)
        }
    },[props.currentUser, setUser])


    
    return (
        <DraftingProvider setStagingState={setStagingState}>
            <div className="main-content-area" style={{ position: "relative" }}>
                <DraftingArea setDialogText={setDialogText} setReloadKey={setReloadKey}></DraftingArea>
                <LibrarySelectionPane dialogText={dialogText} setDialogText={setDialogText} reloadKey={reloadKey} userId={props.currentUser.id}></LibrarySelectionPane>
            </div>
        </DraftingProvider>
        )


}
