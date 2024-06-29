import React, { useEffect, useState } from 'react';
import type { Playlist } from '../types';
// import PlaylistCard from '../ui_components/PlaylistCard';

export async function fetchPlaylists(accessToken:string): Promise<Response> {
    const clientId = "002130106d174cc495fc8443cac019f2";
    // const token = getData("token")
    // const refreshToken = getData("refresh_token");


    
    const res = await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });

    

    return res;
}




// export default function UserLibrary({accessToken}){
//     const [isLoading, setLoading] = useState(false);
//     const [playlistList, setPlaylistList] = useState<Playlist[]|null>(null)

//     useEffect(()=>{

//         setLoading(true);
//         fetchPlaylists(accessToken).then((result)=>{
//             setPlaylistList(result);
//             console.log(result)
//         setLoading(false)});
//     }
//     ,[accessToken])

//     if(playlistList){
//         const playlists = playlistList.map(singlePlaylist =>
//             <PlaylistCard playlist={singlePlaylist}></PlaylistCard>
//             );
//         return <div className='library-container'>{playlists}</div>
//     }else if(isLoading){
//         return<p>Loading...</p>
//     }else{
//         return<p>No playlists found. Plese try again.</p>
//     }

// }