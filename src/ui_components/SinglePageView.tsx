import { useContext, } from "react";
import React from "react";
import { UserProfile } from '../../server/types';

import DraftingArea from "./DraftingPaneComponents/DraftingPane";
import { LibraryComponents } from "./UserLibrary/LibraryComponents";
import { NavigationContext } from "../state_management/NavigationProvider";
import DraftingProvider from "../state_management/DraftingPaneProvider";
import SearchBar from "./SearchPane/SearchBar";



interface UserLibraryProps {
    currentUser: UserProfile
}

export default function UserLibrary(props: UserLibraryProps) {

    const {setStagingState} = useContext(NavigationContext)


    return (
        <DraftingProvider setStagingState={setStagingState}>
            <div className="main-content-area" style={{ position: "relative" }}>
                <DraftingArea ></DraftingArea>
                <LibraryComponents  userId={props.currentUser.id} ></LibraryComponents>
                <SearchBar ></SearchBar>
            </div>
        </DraftingProvider>
        )


}
