import React, { useState, useEffect, useRef } from "react";
import AudioControls from "./AudioControls";
import "../styles/AudioComponent.css";

const AudioPlayer = (props) => {
    const {tracks, currentSong} = props;
    const endpoint = 'https://queenradio-cristi.herokuapp.com';
    const coverEndpoint = 'https://queenradio.s3.eu-central-1.amazonaws.com/';
    const songEndpoint = 'https://queenradio.s3.eu-central-1.amazonaws.com/';
    // State
    const [trackIndex, setTrackIndex] = useState(0);
    const [trackProgress, setTrackProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Destructure for conciseness
    const name = tracks[trackIndex].name;
    const cover = coverEndpoint+tracks[trackIndex].cover;
    const url = songEndpoint+tracks[trackIndex].url;

    // Refs
    const audioRef = useRef(new Audio(url));
    const intervalRef = useRef();
    const isReady = useRef(false);

    // Destructure for conciseness
    const { duration } = audioRef.current;

    const currentPercentage = duration
        ? `${(trackProgress / duration) * 100}%`
        : "0%";
    const trackStyling = `
        -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
    `;

    const startTimer = () => {
        // Clear any timers already running
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
        if (audioRef.current.ended) {
            toNextTrack();
        } else {
            setTrackProgress(audioRef.current.currentTime);
        }
        }, [1000]);
    };

    const onScrub = (value) => {
        // Clear any timers already running
        clearInterval(intervalRef.current);
        audioRef.current.currentTime = value;
        setTrackProgress(audioRef.current.currentTime);
    };

    const onScrubEnd = () => {
        // If not already playing, start
        if (!isPlaying) {
        setIsPlaying(true);
        }
        startTimer();
    };

    const toPrevTrack = () => {
        if (trackIndex - 1 < 0) {
        setTrackIndex(tracks.length - 1);
        } else {
        setTrackIndex(trackIndex - 1);
        }
    };

    const toNextTrack = () => {
        if (trackIndex < tracks.length - 1) {
        setTrackIndex(trackIndex + 1);
        props.changeSong(tracks[trackIndex+1]._id);
        } else {
        setTrackIndex(0);
        props.changeSong(tracks[0]._id);
        }
        
    };

    useEffect(() => {

        if (isPlaying) {
        audioRef.current.play();
        startTimer();
        } else {
        audioRef.current.pause();
        }
    }, [isPlaying]);

    // Handles cleanup and setup when changing tracks
    useEffect(() => {
        audioRef.current.pause();

        audioRef.current = new Audio(url);
        setTrackProgress(audioRef.current.currentTime);

        if (isReady.current) {
        audioRef.current.play();
        setIsPlaying(true);
        startTimer();
        } else {
        // Set the isReady ref as true for the next pass
        isReady.current = true;
        }
    }, [trackIndex]);

    useEffect(() => {
        // Pause and clean up on unmount
        return () => {
        audioRef.current.pause();
        clearInterval(intervalRef.current);
        };
    }, []);

    const setPlayPause = (state) => {
        if(state) {
            audioRef.current.play();
            setIsPlaying(true);
            audioRef.current.play();
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
            audioRef.current.pause();
        }
    }

    // useEffect(() => {
    //     // Pause and clean up on unmount
    //     console.log(currentSong._id, "csdsd")
    //     if(currentSong.name)
    //     return () => {
    //         const index = tracks.map(track => track._id).indexOf(currentSong._id);
    //         setTrackIndex(index);
    //         console.log(tracks, "111")
    //         console.log(index, "aaaa")
    //     };
        
    // }, [currentSong]);

    return (
        <div className="audio-player">
        <div className="track-info">
            <img
            className="artwork"
            src={cover}
            alt={`track artwork for ${name}`}
            />
            <h2 className="name">{name}</h2>
            <AudioControls
            isPlaying={isPlaying}
            onPrevClick={toPrevTrack}
            onNextClick={toNextTrack}
            onPlayPauseClick={setPlayPause}
            />
            <input
            type="range"
            value={trackProgress}
            step="1"
            min="0"
            max={duration ? duration : `${duration}`}
            className="progress"
            onChange={(e) => onScrub(e.target.value)}
            onMouseUp={onScrubEnd}
            onKeyUp={onScrubEnd}
            style={{ background: trackStyling }}
            />
        </div>
        </div>
    );
};

export default AudioPlayer;
