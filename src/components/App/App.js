import React, { useState, useEffect } from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

import Spotify from '../../util/Spotify';

function App() {
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([/*
        { name: 'Lenu', artist: 'Buju', album: 'Single', id: '8923' },
        { name: 'True Love', artist: 'Wizkid', album: 'Made in Lagos', id: '0923' },
        { name: 'Mood', artist: 'Wizkid', album: 'Made in Lagos', id: '6729' },*/
  ]);
  const [searchResults, setSearchResults] = useState([/*
        { name: 'True Love', artist: 'Wizkid', album: 'Made in Lagos', id: '0923' },
        { name: 'Mood', artist: 'Wizkid', album: 'Made in Lagos', id: '6729' },
        { name: 'Lenu', artist: 'Buju', album: 'Single', id: '8923' },
        { name: 'Piece of Me', artist: 'Wizkid', album: 'Made in Lagos', id: '2279' },
        { name: 'Walkin Blind', artist: 'Patti Smith', album: 'Dead Man Walking', id: '8023' }*/
  ]);

  const addTrack = (track) => {
    const found = playlistTracks.some(existing => existing.id === track.id);
    if (!found) {
      setPlaylistTracks([...playlistTracks, track]);
    };
  }

  const removeTrack = (track) => {
    const updatedPlaylistTracks = playlistTracks.filter(existing => existing.id !== track.id);
    setPlaylistTracks(updatedPlaylistTracks);
  }

  const updatePlaylistName = (newName) => {
    setPlaylistName(newName);
  }

  const savePlaylist = () => {
    const trackURIs = playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(playlistName, trackURIs).then(snapshotID => {
      if (snapshotID) {
        alert('Playlist saved!\nCheck out your Spotify account to enjoy your Jams.');
        // Clear playlist after successful save.
        setPlaylistName('New Playlist');
        setPlaylistTracks([])
      }
    });
  }

  const search = (term) => {
    // Persist search term to browser storage incase of redirection to spotify for auth.
    sessionStorage.setItem('term', term);
    Spotify.search(term).then(newSearchResults => {
      if (newSearchResults) {
        setSearchResults(newSearchResults);
      }
      // Clear browser session storage after 'successful' search.
      sessionStorage.clear();
    });
  }

  useEffect(() => {
    // Attempt to grab token from url in cases of redirection from spotify authorization.
    Spotify.saveAccessToken();
    if (sessionStorage.getItem('term')) {
      // Re-execute search for term from previous attempt, found in sessionStorage.
      search(sessionStorage.getItem('term'));
    }
  }, []);

  return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar onSearch={search} />
        <div className="App-playlist">
          <SearchResults searchResults={searchResults} onAdd={addTrack} />
          <Playlist name={playlistName} tracks={playlistTracks} onRemove={removeTrack} onNameChange={updatePlaylistName} onSave={savePlaylist} />
        </div>
      </div>
    </div>
  );
}

export default App;