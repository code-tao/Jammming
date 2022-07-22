import React from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistName: '',
      playlistTracks: [/*
        { name: 'Lenu', artist: 'Buju', album: 'Single', id: '8923' },
        { name: 'True Love', artist: 'Wizkid', album: 'Made in Lagos', id: '0923' },
        { name: 'Mood', artist: 'Wizkid', album: 'Made in Lagos', id: '6729' },*/
      ],
      searchResults: [/*
        { name: 'True Love', artist: 'Wizkid', album: 'Made in Lagos', id: '0923' },
        { name: 'Mood', artist: 'Wizkid', album: 'Made in Lagos', id: '6729' },
        { name: 'Lenu', artist: 'Buju', album: 'Single', id: '8923' },
        { name: 'Piece of Me', artist: 'Wizkid', album: 'Made in Lagos', id: '2279' },
        { name: 'Walkin Blind', artist: 'Patti Smith', album: 'Dead Man Walking', id: '8023' }*/
      ]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    const found = this.state.playlistTracks.some(existing => existing.id === track.id);
    if (!found) {
      const updatedPlaylistTracks = this.state.playlistTracks;
      updatedPlaylistTracks.push(track);
      this.setState({
        playlistTracks: updatedPlaylistTracks
      });
    };
  }

  removeTrack(track) {
    const updatedPlaylistTracks = this.state.playlistTracks.filter(existing => existing.id !== track.id);
    this.setState({
      playlistTracks: updatedPlaylistTracks
    });
  }

  updatePlaylistName(newName) {
    this.setState({
      playlistName: newName
    });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    });
  }

  search(term) {
    // Persist search term to browser storage incase of redirection to spotify for auth.
    sessionStorage.setItem('term', term);
    Spotify.search(term).then(newSearchResults => {
      this.setState({
        searchResults: newSearchResults
      })
      // Clear browser session storage after 'successful' search.
      sessionStorage.clear();
    });
  }

  componentDidMount() {
    // Attempt to grab token from url in cases of redirection from spotify authorization.
    Spotify.saveAccessToken();
    if  (sessionStorage.getItem('term')) {
      // Re-execute search for term from previous attempt, found in sessionStorage.
      this.search(sessionStorage.getItem('term'));
    }
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist name={this.state.playlistName} tracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;