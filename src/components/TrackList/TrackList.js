import React from "react";
import './TrackList.css';

import Track from "../Track/Track";

function TrackList({ tracks, isRemoval, onAdd, onRemove }) {
    return (
        <div className="TrackList">
            {tracks.map(track => <Track key={track.id} track={track} isRemoval={isRemoval} onAdd={onAdd} onRemove={onRemove} />
            )}
        </div>
    )
}

export default TrackList;