import { Request as expressRequest, Response as expressResponse} from 'express';
import { PlaylistItem, Tracklist } from '../../../types';
// import { PlaylistItem, Tracklist } from '../../types';
type FetchResponse = Response;  //Fetch API Response

export async function fetchPlaylistsItems(playlistId:string, offset:number, accessToken:string): Promise<FetchResponse> {
    const limit = 50
    const offsetIdx = limit*offset


    const playlistItemEndpoint = "https://api.spotify.com/v1/playlists/" + playlistId + `/tracks?limit=${limit}&offset=${offsetIdx}`

    const res = await fetch(playlistItemEndpoint, {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });

    return res


}


export const playlistItems = async (req: expressRequest, res: expressResponse)=>{
    const accessToken = req.cookies.access_token? req.cookies.access_token:res.locals.access_token
    // console.log(req.headers)
    // console.log(accessToken)
    
    if(typeof req.headers['id'] === "string" && typeof accessToken !== "undefined"){
        const playlistId = req.headers['id']
        let allPlaylistItems : PlaylistItem[] = []
        let nextItems: string|null = null
        //let allNamesAndArtists : string[] = []
        let offset = 0
        // console.log(playlistId)
        while(offset<2){

            const playlistObject = await fetchPlaylistsItems(playlistId, offset, accessToken).then(async (response) => {

                if(response.ok){
                    console.log("OK response from spotify-data/playlist-items")
                    const playlistObject:Tracklist = await response.json();
                    return playlistObject
                }else{
                    const error = await response.json()
                    console.error("Failed to retrieve playlist items (/spotify-data/playlist-items): ", error)
                    // res.redirect('/logout')
                    return
                }
            }).catch((e:Error)=>{
            // res.clearCookie('authorizing')
            // res.clearCookie('access_token')
            // res.clearCookie('refresh_token')
            console.error("Fetch operation failed (/spotify-data/playlist-items): ", e)
            })

            if(playlistObject){
                const playlistItems: PlaylistItem[] = playlistObject.items;
                console.log(playlistObject)
                for(let i = playlistItems.length-1; i>=0; i--){
                    // console.log(`Track #${i} `, playlistItems[i].track)
                    if(playlistItems[i].track===null){
                        console.error(`Playlist item #${i} contains an invalid track`)
                        playlistItems.splice(i,1)
                    }else{
                        playlistItems[i].track.images = playlistItems[i].track.album.images
                    }
                }
                allPlaylistItems = allPlaylistItems.concat(playlistItems)
                // console.log(allPlaylistItems)
                //TODO: Remove below for-loop after testing
                // for(let item of playlistItems){
                //     allNamesAndArtists.push(` ${item.track.name} by ${item.track.artists[0].name}`)
                // }
                //console.log(`Playlist items batch #${offset}: `, playlistItems)
                if(playlistObject.next){
                    console.log("next: ",playlistObject.next)
                    offset+=1
                    console.log("offset: ",offset)
                    nextItems = playlistObject.next
                }else{
                    //console.log("All Playlist Items: ",allPlaylistItems)
                    //console.log(allNamesAndArtists)
                    nextItems = null
                    console.log("No NEXT: ", nextItems)

                    res.send({
                        next: nextItems,
                        items: allPlaylistItems})
                    return
                }

            }else{
                console.error("No playlist object found (/spotify-data/playlist-items)")
            }
        }
        console.log("Total playlist items found: ", allPlaylistItems.length)
                    res.send({
                        next: nextItems,
                        items: allPlaylistItems})
    }else{
        console.error("No playlistID||accesstoken found (/spotify-data/playlist-items): ", `id=${req.headers['id']}, accesstoken=${accessToken}`)
    }
}