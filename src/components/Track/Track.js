import React from "react";
import './Track.css';

export default class Track extends React.Component {
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }

    addTrack() {
        this.props.onAdd(this.props.track);
    }

    removeTrack() {
        this.props.onRemove(this.props.track);
    }

    renderAction() {
        const isRemoval = this.props.isRemoval;
        if (this.props.isRemoval) {
            return (
                <button className="Track-action" onClick={this.removeTrack}>-</button>
            )
        } else {
            return (
                <button className="Track-action" onClick={this.addTrack}>+</button>
            )
        };
    }

    render() {
        const track = this.props.track;
        return (
            <div className="Track">
                <div className="Track-image">
                    <img src={track.imageUrl} alt="album-art"/>
                </div>
                <div className="Track-information">
                    <h3>{track.name}</h3>
                    <p>{track.artist} | {track.album}</p>
                </div>
                {this.renderAction()}
            </div>
        )
    }
}