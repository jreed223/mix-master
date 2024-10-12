import React from "react"
// import { Features, PlaylistItem } from "../../../server/types";
// import PlaylistClass from "../../models/playlistClass";
interface PlaylistMenuProps{
    onExit:() => void;
    togglefeatures: () => void


}
const PlaylistMenuBar:React.FC<PlaylistMenuProps>=(props: PlaylistMenuProps)=>{


        return (
            <div className="playlist-creation-menu-bar" >
                <button onClick={()=>props.onExit()}>Close</button>
                <button  onClick={()=>{props.togglefeatures()}}>Audio Features</button>

            </div>
        )


    
}

export default PlaylistMenuBar