import React from "react";
import './Playlist.css'

import TrackList from '../TrackList/TrackList';

export default class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSaveToSpotify = this.handleSaveToSpotify.bind(this);
    }

    handleNameChange(e) {
        this.props.onNameChange(e.target.value);
    }

    handleSaveToSpotify(e) {
        this.props.onSave()
    }

    render() {
        const tracks = this.props.tracks;
        
        return (
            <div className="Playlist">
                <input value={this.props.name} onChange={this.handleNameChange} />
                <TrackList tracks={tracks}  onRemove={this.props.onRemove} isRemoval={true} />
                <button className="Playlist-save" onClick={this.handleSaveToSpotify}>SAVE TO SPOTIFY</button>
            </div>
        );
    }
}
