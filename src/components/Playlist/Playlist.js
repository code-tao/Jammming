import React from "react";
import './Playlist.css'

import TrackList from '../TrackList/TrackList';

function Playlist({ tracks, name, onNameChange, onRemove, onSave }) {

    const handleNameChange = (e) => {
        onNameChange(e.target.value);
    }

    const handleSaveToSpotify = (e) => {
        onSave()
    }

    return (
        <div className="Playlist">
            <input value={name} onChange={handleNameChange} />
            <TrackList tracks={tracks} onRemove={onRemove} isRemoval={true} />
            <button className="Playlist-save" onClick={handleSaveToSpotify}>SAVE TO SPOTIFY</button>
        </div>
    );
}

export default Playlist;
