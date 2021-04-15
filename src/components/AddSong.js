import React, {useState} from 'react';
import axios from 'axios';
import "../styles/AddSong.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import {Link} from 'react-router-dom';


function Player() {

    const endpoint = 'https://queenradio-cristi.herokuapp.com';
    const [name, setName] = useState('');
    const [cover, setCover] = useState('');
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [loading, setLoading] = useState(false);

    const submitSong = (e) => {
        e.preventDefault();
        if(name.length && cover && url){
            setLoading(true);
            const formData = new FormData();
            formData.append('name',name);
            formData.append('coverFile',cover);
            formData.append('songFile',url);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            axios.post(endpoint+'/collection/song',formData, config)
            .then(res => {
                // console.log(res.data);
                displayNotice('Upload successfull')
                setLoading(false);
            }).catch(err => {
                displayError("There was an error uploadig the song");
                console.log(err)
            })
        } else {
            displayError("All field are required");
        }
    }

    const displayError = (msg) => {
        setError(msg);
        setTimeout(() => {
            setError('');
        }, 2500)
    }

    const displayNotice = (msg) => {
        setNotice(msg);
        setTimeout(() => {
            setNotice('');
        }, 2500)
    }

    return (
      <div className="form-wrapper">
        <div className="main-area">
            {!loading ? 
            <form encType="multipart/form-data" action={endpoint+'/collection/song'} method="post" onSubmit={submitSong}>
            <h2>Add song</h2>
            {error.length ? <div className="error">{error}</div> : ''}
            {notice.length ? <div className="notice">{notice}</div> : ''}
                <label htmlFor="name">Song name</label>
                <input type="text" name="name"  onChange={e => setName(e.target.value)}/>
                <label htmlFor="name">Song cover image</label>
                <input type="file" name="cover" accept="image/png, image/jpeg, image/jpg" onChange={e => setCover(e.target.files[0])}/>
                <label htmlFor="name">Song mp3 file</label>
                <input type="file" name="url" accept="audio/mp3" onChange={e => setUrl(e.target.files[0])}/>
                <button type="submit" name="submit">Add song</button>
            </form>
            : <div className="loader"><Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}
            visible={loading}
            timeout={5000}
          /></div>}
            <Link id="back-btn" to="/">Back to player</Link>
        </div>
      </div>
    );
  }

export default Player;