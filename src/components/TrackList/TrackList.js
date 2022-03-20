import React from "react";
import './TrackList.css';

import Track from "../Track/Track";

export default class TrackList extends React.Component {
    render() {
        const tracks = this.props.tracks;
        console.log(tracks);
        return (
            <div className="TrackList">
                {tracks.map(track => <Track key={track.id} track={track} isRemoval={this.props.isRemoval} onAdd={this.props.onAdd} onRemove={this.props.onRemove} />
                )}
            </div>
        )
    }
}