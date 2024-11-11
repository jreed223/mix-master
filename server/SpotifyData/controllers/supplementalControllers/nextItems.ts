import { Request as expressRequest, Response as expressResponse} from 'express';
import { PlaylistItem, Tracklist } from '../../../types';
// type FetchResponse = Response;  //Fetch API Response




export const nextItems = async (req: expressRequest, res: expressResponse)=>{
    const accessToken = req.cookies.access_token? req.cookies.access_token:res.locals.access_token
    const nextLink = req.body.next
    if(accessToken && nextLink){
      const nextTracks:Tracklist = await  fetch(nextLink,{
            method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
        }).then(async (response)=>{
            if(response.ok){
                console.log("OK response from spotify-data/next-playlist-items")
                const trackData  = await response.json();

                return trackData
                
                // res.send(trackData)
            }else{
                const error = await response.json()
                console.error("Failed to retrieve playlists (/spotify-data/next-playlist-items): ", error)
            }
        }).catch((e: Error)=>{
            console.error("Fetch operation failed (/spotify-data/playlist-items): ", e)
        })

        if(nextTracks){
            const playlistItems: PlaylistItem[] = nextTracks.items;
            // console.log(playlistObject)
            for(let i = playlistItems.length-1; i>=0; i--){
                // console.log(`Track #${i} `, playlistItems[i].track)
                if(playlistItems[i].track===null){
                    console.error(`Playlist item #${i} contains an invalid track`)
                    playlistItems.splice(i,1)
                }else{
                    playlistItems[i].track.images = playlistItems[i].track.album.images
                }
            }
            res.send(nextTracks)
    }
}

}