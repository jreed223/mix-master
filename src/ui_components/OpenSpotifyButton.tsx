import React from "react"

    
    
    export default function openSpotify(query:string|null, hideText:boolean = false) {
        return <a href={query} target="_blank" rel="noreferrer" style={{ flex: "1", maxWidth: hideText ? "45px" : "177px", transition: "1s" }}>
            <div style={{ cursor: "pointer", flex: "1 1 auto ", margin: "5px auto", height: "100%", transition: "1s", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img src="/spotify/Primary_Logo_Green_RGB.svg" style={{ maxWidth: "45px" }} alt="spotify logo" />
                <p style={{ whiteSpace: "nowrap", fontSize: "1em", overflow: "hidden", margin: " 0 0 0 2px", opacity: hideText ? 0 : 1, transition: '1s' }}>Open Spotify</p>
                {/* <div style={{ marginBottom: isMobile ? "10px" : "0px", borderRadius: "25px", height: "30px",  transition: "1s", display:"flex", alignItems:'center' }} onKeyDown={(e) => e.preventDefault()} onClick={(e) => { e.preventDefault(); }}> */}
                {/* <div style={{display: "flex", alignItems:"center", maxHeight: "100%"}}> */}
                {/* <img src="/spotify/Primary_Logo_Green_RGB.svg" style={{maxHeight: "100%"}} alt="spotify logo"/><p style={{ whiteSpace:"nowrap"}}>Open Spotify</p> */}
                {/* </div> */}
                {/* </div> */}
            </div>
        </a>
    }