import React from "react";
import './Track.css';

function Track({ track, isRemoval, onAdd, onRemove }) {

    const addTrack = () => {
        onAdd(track);
    }

    const removeTrack = () => {
        onRemove(track);
    }

    const renderAction = () => {
        if (isRemoval) {
            return (
                <button className="Track-action" onClick={removeTrack}>-</button>
            )
        } else {
            return (
                <button className="Track-action" onClick={addTrack}>+</button>
            )
        };
    }

    return (
        <div className="Track">
            <div className="Track-image">
                <img src={track.imageUrl} alt="album-art" />
            </div>
            <div className="Track-information">
                <h3>{track.name}</h3>
                <p>{track.artist} | {track.album}</p>
            </div>
            {renderAction()}
        </div>
    )
}

export default Track;