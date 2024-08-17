export interface UserProfile {
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

export interface Image {
    url: string;
    height: number;
    width: number;
}

export interface Playlist {
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
    type: "playlist";
    uri: string;
}

export interface CategorizedPlaylist {
    id: string;
    image: Image;
    name: string;
    owner: {display_name: string; external_urls: {spotify: string;}; href: string; id: string; type: string; uri: string;}
    snapshot_id: string;
    uri: string;
    totalTracks: number;
    categories?: {tag_list: Tag[] | null, top_tags: Record<string, Track[]>|null}|null
    tracks?: PlaylistItem[]
}


export interface Album {
    added_at: Date
    album:{
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
        type:"album"
        uri:string
        artists:Artist[]
        tracks: {
            href: string
            limit: number
            next: string|null
            offset: number
            pevious: string|null
            total: number
            items: Track[]
        }
    }
}

export interface Artist{
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

export interface Track {
    album: Album
    artists: Artist[]
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids: {isrc: string, ean: string, upc:string}
    external_urls: {spotify:string }
    href:string
    id:string|null
    is_playable:boolean
    name:string
    popularity:number
    preview_url:string|null
    type: string
    uri: string
    is_local: boolean
    audio_features: Features|null
}

export interface PlaylistItem {
    added_at: Date
    added_by: UserProfile
    track:Track
}
export interface Tracklist {
    href: string
    limit: number
    next: string|null
    offset: number
    previous: string|null
    total: number
    items: PlaylistItem[]
}

export interface AlbumList {
    href: string
    limit: number
    next: string|null
    offset: number
    pevious: string|null
    total: number
    items: Album[]
}

export interface LikedSongs{
    type: "liked songs"
    href: string
    limit: number
    next: string|null
    offset: number
    pevious: string|null
    total: number
    items: [{
        added_at: Date
        track: Track
    }]
}

export interface Features {
    analysis_url: string|null
    acousticness: number|null
    danceability: number|null
    energy: number|null
    instrumentalness: number|null
    key: number|null
    liveness: number|null
    loudness: number|null
    mode: number|null
    tempo: number|null
    time_signature: number|null
    valence: number|null
}

export interface Tag {
    count: number
    name: string
    url: string
}


