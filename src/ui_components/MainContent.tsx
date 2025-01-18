import { useContext, useEffect, useMemo, useState, } from "react";
import React from "react";
import type { UserProfile } from '../../server/types.d.ts';

import DraftingArea from "./DraftingPaneComponents/DraftingPane.tsx";
// import { LibraryComponents } from "./UserLibrary/LibraryComponents";
import { ViewContext } from "../state_management/ViewProvider.tsx";
// import SearchBar from "./SearchPane/SearchBar";
import { submissionStatusState } from "./DraftingPaneComponents/Playlists/DraftPlaylistArea.tsx";
import { LibrarySelectionPane } from "./LibrarySelectionComponents/LibrarySelectionPane.tsx";



interface UserLibraryProps {
    currentUser: UserProfile
}

export default function MainContent(props: UserLibraryProps) {

    const { setUser} = useContext(ViewContext)
    // const {setStagingState} = useContext(DraftingContext)

    const [reloadKey, setReloadKey] = useState<number>(0)
    const [dialogText, setDialogText]=useState<submissionStatusState>(null)

    useEffect(()=>{
        if(props.currentUser){
            setUser(props.currentUser)
        }
    },[props.currentUser, setUser])


    
    return (
        // <DraftingProvider >
            <div className="main-content-area" style={{ position: "relative" }}>
                <DraftingArea setDialogText={setDialogText} setReloadKey={setReloadKey}></DraftingArea>
                <LibrarySelectionPane dialogText={dialogText} setDialogText={setDialogText} reloadKey={reloadKey} userId={props.currentUser.id}></LibrarySelectionPane>
            </div>
        // </DraftingProvider>
        )


}
