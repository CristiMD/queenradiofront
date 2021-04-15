import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AudioComponent from './AudioComponent';
import '../styles/Player.css';
import {Link} from 'react-router-dom';

function Player() {

    const endpoint = 'https://queenradio-cristi.herokuapp.com';
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState({});

    const getSongs = () => {
        axios.get(endpoint+'/collection/songs').then(res => {
            console.log(res.data);
            setSongs(res.data)
            setCurrentSong(res.data[0]);
        }).catch(err => {
            console.log(err)
        })
    }

    const changeSong = (id) => {
        console.log(id)
        const selected = songs.filter(song => song._id === id);
        setCurrentSong(selected[0]);
    }

    useEffect(()=>{
        getSongs();
    },[]);

    return (
      <div id="player">
        <div className="main-area">
            <div className="songs-list">
                <div className="songs-wrapper">
                    <h3>Playlist</h3>
                    <div className="songs">
                        {songs.length ? songs.map(song => {
                            return <div onClick={() => changeSong(song._id)} key={song._id} id={currentSong._id === song._id ? "selected" : ''} className="song-detail">{song.name}</div>;
                        }) : 'No songs'}
                        </div>
                    <Link className="add-song" to="/add">Add song</Link>
                </div>
            </div>
            {songs.length && currentSong.name ?
            <AudioComponent currentSong={currentSong} changeSong={changeSong} tracks={songs} />
            : ""}
        </div>
      </div>
    );
  }

export default Player;