import { useState } from "react";
import React from "react";
import { UserProfile } from '../../server/types';

import TrackCollection from "../models/libraryItems";
import DraftingArea from "./DraftingPaneComponents/DraftingPane";
import SearchBar from "./SearchBar";
import TrackClass from "../models/Tracks";
import { ActiveView } from "./NavBar";
import { LibraryComponents } from "./UserLibrary/LibraryComponents";



interface UserLibraryProps {
    currentUser: UserProfile
    activeView: ActiveView[]
    setActiveView: React.Dispatch<React.SetStateAction<ActiveView[]>>
    setDisabledDashboard: React.Dispatch<React.SetStateAction<boolean>>
    isSearching: boolean
    setIsSearching: React.Dispatch<React.SetStateAction<boolean>>
    stagingState: string
    setStagingState: React.Dispatch<React.SetStateAction<string>>
}

export default function UserLibrary(props: UserLibraryProps) {

    const [selectedLibraryItem, setSelectedLibraryItem] = useState<TrackCollection | null>(null)
    const [stagedPlaylist, setStagedPlaylist] = useState<TrackClass[]>([])


    const displayTracks = (selection: TrackCollection, currentView: ActiveView) => {
        props.setStagingState("open")
        props.setActiveView([currentView])
        props.setDisabledDashboard(true)
        if (selection.id !== selectedLibraryItem?.id) {
            setSelectedLibraryItem(selection)
        }
    }

    return (
        <div className="main-content-area" style={{ position: "relative" }}>

            <DraftingArea stagedPlaylist={stagedPlaylist} setStagedPlaylist={setStagedPlaylist} setIsSeraching={props.setIsSearching} setDisabledDashboard={props.setDisabledDashboard} isSearching={props.isSearching} selectedLibraryItem={selectedLibraryItem} setStagingState={props.setStagingState} stagingState={props.stagingState} setActiveView={props.setActiveView} activeView={props.activeView} ></DraftingArea>

            <LibraryComponents setStagingState={props.setStagingState} setActiveView={props.setActiveView} setIsSearching={props.setIsSearching} isSearching={props.isSearching} stagingState={props.stagingState} activeView={props.activeView} userId={props.currentUser.id} selectedLibraryItemId={selectedLibraryItem?.id} onPlaylistSelection={displayTracks}></LibraryComponents>

            <SearchBar setSelectedLibraryItem={setSelectedLibraryItem} setStagingState={props.setStagingState} stagedPlaylist={stagedPlaylist} setStagedPlaylist={setStagedPlaylist} setActiveView={props.setActiveView} setDisabledDashboard={props.setDisabledDashboard} stagingState={props.stagingState} setIsSearching={props.setIsSearching} isSearching={props.isSearching} activeView={props.activeView}></SearchBar>

        </div>)


}
