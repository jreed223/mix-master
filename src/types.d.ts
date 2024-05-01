interface UserProfile {
    country: string;
    display_name: string;
    email: string;
    explicit_content: {
        filter_enabled: boolean,
        filter_locked: boolean
    },
    external_urls: { spotify: string; };
    followers: { href: string; total: number; };
    href: string;
    id: string;
    images: Image[];
    product: string;
    type: string;
    uri: string;
}

interface Image {
    url: string;
    height: number;
    width: number;
}

interface Playlist {
    collaborative: boolean;
    description: string;
    external_urls: {spotify: string;};
    href: string;
    id: string;
    images: Image[];
    name: string;
    owner: {display_name: string; external_urls: {spotify: string;}; href: string; id: string; type: string; uri: string;}
    primary_color: string|null;
    public: boolean;
    snapshot_id: string;
    tracks: {href: string; total: number;}
    type: string;
    uri: string;
}

interface Album {
    album_type: string
    total_tracks: number
    available_markets: string[]
    external_urls:{spotify:string}
    href:string
    id:string
    images: Image[]
    name:string
    release_date:string
    release_date_precision:string
    type:string
    uri:string
    artists:Artist[]
}

interface Artist{
    external_urls:{spotify:string}
    genres: string[]
    href:string
    id:string
    images: Image[]
    name:string
    popularity:number
    type:string
    uri:string

}

interface Song {
    album: Album
    artists: Artist[]
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids: {isrc: string, ean: string, upc:string}
    external_urls: {spotify:string }
    href:string
    id:string
    is_playable:boolean
    name:string
    popularity:number
    preview_url:string|null
    type: string
    uri: string
    is_local: boolean

}
interface PlaylistItems {
    added_at: Date
    added_by: UserProfile
    track:Song

}