import React, { useContext, useEffect, useRef, useState } from "react"
import { NavigationContext } from "../../state_management/NavigationProvider"
import { DraftingContext } from "../../state_management/DraftingPaneProvider"
import { TracklistContext } from "../../state_management/TracklistProvider"
import Calendar from 'react-calendar';
import { Artist } from '../../../server/types';

// import { Features, PlaylistItem } from "../../../server/types";
// import PlaylistClass from "../../models/playlistClass";
interface PlaylistMenuProps {


    // draftingPaneContainer: React.MutableRefObject<any>



}
const FilterMenu: React.FC<PlaylistMenuProps> = () => {
    const {isMobile, isMaxDraftView}= useContext(NavigationContext)
    const {
        displayFeatureMenu  } = useContext(DraftingContext)
        // const {allTracks}= useContext
    const {allTracks, selectedFeatures, setSelecetedFeatures, setPopularityFilter, popularityFilter, dateRange, setDateRange, artistQuery, setArtistQuery, artistsList, setArtistsList, setSelectedArtistFilters, selectedArtistFilters } = useContext(TracklistContext)
    const [currentList, setCurrentList] = useState<Artist[]>(null)


    const inputControls = [
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature: "danceability", inputType: "range", min: "0", max: "100", default: "50", tooltipText: 'Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.' },
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature: "energy", inputType: "range", min: "0", max: "100", default: "50", tooltipText: 'Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.' },
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature: "instrumentalness", inputType: "range", min: "0", max: "100", default: "50", tooltipText: 'Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.' },
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature: "acousticness", inputType: "range", min: "0", max: "100", default: "50", tooltipText: 'A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.' },
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature: "valence", inputType: "range", min: "0", max: "100", default: "50", tooltipText: 'A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).' },
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature: "key", inputType: "range", min: "-1", max: "11", default: "4", tooltipText: 'The key the track is in. Integers map to pitches using standard Pitch Class notation. E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on. If no key was detected, the value is -1.' }, //ABS
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature: "liveness", inputType: "range", min: "0", max: "100", default: "50", tooltipText: 'Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.' },
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature: "loudness", inputType: "range", min: "-60", max: "0", default: "-30", tooltipText: 'The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db.' }, //ABSRange
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature: "mode", inputType: "range", min: "0", max: "1", default: "1", tooltipText: 'Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by 1 and minor is 0.' }, //ABS
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature: "speechiness", inputType: "range", min: "0", max: "100", default: "50", tooltipText: 'Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.' },
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature: "tempo", inputType: "range", min: "0", max: "200", default: "100", tooltipText: 'The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.' }, //ABSRange
        { checkboxRef: useRef(null), sliderRef: useRef(null), audioFeature: "time_signature", inputType: "range", min: "3", max: "7", default: "5", tooltipText: 'An estimated time signature. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure). The time signature ranges from 3 to 7 indicating time signatures of "3/4", to "7/4".' }, //ABS
    ];

    useEffect(()=>{
        if(artistsList?.length>0 && artistQuery){
            const filteredArtists = artistsList.filter((artist)=>artist.name.toLowerCase().startsWith(artistQuery.toLowerCase()))
            setCurrentList(filteredArtists)
        }else if(artistsList){
          setCurrentList(artistsList)

        }
    },[allTracks, artistQuery, artistsList, setArtistsList])


    const handleAudioFeatures = (index) => {
        const { checkboxRef, sliderRef, audioFeature } = inputControls[index];
        sliderRef.current.disabled = checkboxRef.current.checked;
        const currentSelection = { ...selectedFeatures }

        if (checkboxRef.current.checked && selectedFeatures[audioFeature]) {
            sliderRef.current.disabled = true
            delete currentSelection[audioFeature]

            setSelecetedFeatures(currentSelection)
            // props.onFilterSet(currentSelection)

            console.log(selectedFeatures)

        } else {
            sliderRef.current.disabled = false

            currentSelection[audioFeature] = parseInt(sliderRef.current.value)

            setSelecetedFeatures(currentSelection)
            console.log(selectedFeatures)
            // props.onFilterSet(currentSelection)

        }


    }

    const popularityCheckbox = useRef(null)
    const popularitySlider = useRef(null)
    const artistSearch = useRef(null)

    const handlePopularityFilter = () => {

        if (popularityCheckbox.current.checked) {
            popularitySlider.current.disabled = true
            setPopularityFilter(null)

        } else {
            popularitySlider.current.disabled = false

            const selectedPopularity = parseInt(popularitySlider.current.value)

            setPopularityFilter(selectedPopularity)
            // props.onFilterSet(currentSelection)

        }

    }

    // const toggleSearch =()=>{


    // }

    const [calendarDisabled, setCalendarDisabled] = useState<boolean>(true)

    const toggleCalendar = () => {
        if (!calendarDisabled) {
            setDateRange(null)
        }
        setCalendarDisabled(prev => !prev)
        // console.log(calendarDisabled)
        console.log(dateRange)


    }

    const handleDateSelection = (dates: Date | [Date, Date]) => {
        if (Array.isArray(dates)) {
            console.log("DATES: ", `\n Date 1: ${dates[0]} \n Date 2: ${dates[1]}`)
            // const dateList: [] = dates
            setDateRange(dates);
        }else{
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            setDateRange(null)
        }
    };

    
    const disableFutureDates = (date: Date) => {
        return date > new Date();  // Disable any date in the future
    };




    return (
        <div style={{ display: "flex", overflowX: "hidden", flexDirection: "column", flex: isMaxDraftView&&displayFeatureMenu?"1":displayFeatureMenu?"1":"0"  }} className="new-playlist">
            {
            //TODO: Uncomment the below code when application is given a production license, this will allow filetring using audio features endpoint
            /* {inputControls.map((inputControl, index)=>{

            return(   
            <div key={inputControl.audioFeature+"-div"} style={{width: isMaxDraftView?"33.3vw":"12.5vw", transition: "1s"}}>  
                <input key={inputControl.audioFeature+"-checkbox"}ref={inputControl.checkboxRef} onChange={()=>handleAudioFeatures(index)} type="checkbox" defaultChecked={true}/>
                <label>{inputControl.audioFeature}</label><div className="tooltip"> ? <span className="tooltip-text">{inputControl.tooltipText}</span></div>
                <input key={inputControl.audioFeature+"-slider"} style={{width: "80%"}} ref={inputControl.sliderRef} id={`${inputControl.audioFeature}-slider`} onChange={()=>handleAudioFeatures(index)} type={inputControl.inputType} min={inputControl.min} max={inputControl.max} defaultValue={inputControl.default} className="slider" disabled={true}/>
            </div>
            )
        })

            } */}
            <div style={{width: isMaxDraftView?"33.3vw": isMobile?"calc(50vw - 3px)":"calc(25vw - 3px)", transition: "1s", margin: "2% auto 0"}}>
                <div key={"popularity-div"} style={{ width: "100%", transition: "1s" }}>
                    <label style={{}}>popularity</label>
                    <div className="tooltip"> ? <span className="tooltip-text">{'tooltip Text!!'}</span></div>
                    <div>
                        <input key={"popularity-checkbox"} ref={popularityCheckbox} onChange={() => handlePopularityFilter()} type="checkbox" defaultChecked={true} />
                        <input key={"popularity-slider"} ref={popularitySlider} style={{ width: "80%", margin: 'auto' }} id={`popularity-slider`} onChange={() => handlePopularityFilter()} type={"range"} min={0} max={100} defaultValue={50} className="slider" disabled={true} />
                    </div>
                </div>
                <div key={"calendar-div"} style={{ width: "100%", transition: "1s" }}>
                    <p style={{display: "inline-block"}}>Date Range</p>
                    <div className="tooltip"> ? <span className="tooltip-text">{'tooltip Text!!'}</span></div>
                    <input key={"calendar-checkbox"} ref={null} onChange={() => { toggleCalendar() }} type="checkbox" defaultChecked={true} />
                    <div>
                        <Calendar onChange={(date) => handleDateSelection(date)} value={dateRange} selectRange={true} tileDisabled={ calendarDisabled?()=>true:({ date }) => disableFutureDates(date)}></Calendar>
                        {/* <input key={"popularity-slider"} ref={popularitySlider} style={{width: "80%", margin:'auto'}} id={`popularity-slider`} onChange={()=>handlePopularityFilter()} type={"range"} min={0} max={100} defaultValue={50} className="slider" disabled={true}/> */}
                    </div>
                </div>
                <div key={"artists-div"} style={{ width: "100%", transition: "1s" }}>
                    <p style={{display: "inline-block"}}>Artist 1</p>
                    <div className="tooltip"> ? <span className="tooltip-text">{'tooltip Text!!'}</span></div>
                    <div>
                        {/* <input key={"artist-checkbox"} ref={null} onChange={() => handlePopularityFilter()} type="checkbox" defaultChecked={true} /> */}
                        <input key={"artist-search"} ref={artistSearch} style={{ width: "80%", margin: 'auto' }} id={`artist-searchr`} onChange={(e) => setArtistQuery(e.target.value)} value={artistQuery} type={"search"} placeholder={"Search Artists"} className="slider" disabled={false} />
                    </div>
                    <>{artistsList&&artistsList.length>0?<div>
                        {artistsList.map((artist:Artist)=>{
                            if(currentList?.some((item:Artist)=>item.id===artist.id)){

                            
                           return (<div>
                                        <input key={"artist-checkbox"} ref={null} onChange={(e) => e.target.checked?setSelectedArtistFilters(prev=>prev.concat([artist])):setSelectedArtistFilters(selectedArtistFilters?.length>0?selectedArtistFilters.filter(filterArtist=>filterArtist.name!==artist.name):[])} type="checkbox" defaultChecked={false} />
                                                <label style={{}}>{artist.name}</label>
                            </div>)
                            }else{
                                return (<div style={{display:"none"}}>
                                    <input key={"artist-checkbox"} ref={null} onChange={(e) => e.target.checked?setSelectedArtistFilters(prev=>prev.concat([artist])):setSelectedArtistFilters(selectedArtistFilters?.length>0?selectedArtistFilters.filter(filterArtist=>filterArtist.name!==artist.name):[])} type="checkbox" defaultChecked={false} />
                                            <label style={{}}>{artist.name}</label>
                        </div>)
                            }
                        })}
                    </div>:<></>
                        }
                    </>
                </div>
            </div>

        </div>
    )



}

export default FilterMenu