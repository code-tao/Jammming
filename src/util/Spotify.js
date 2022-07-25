let userAccessToken = '';
let expirationTime = '';
let tokenType = 'Bearer ';

const clientID = '45ef46e4eacf447d8ef2a68da2aa6dc2';
const redirectURI = 'http://localhost:3000';
const scope = 'playlist-modify-private, playlist-modify-public';
const responseType = 'token';


const Spotify = {
    saveAccessToken() {
        // Check and save if access token is in url.
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            userAccessToken = accessTokenMatch[1];
            expirationTime = Number(expiresInMatch[1]);
            window.setTimeout(() => { userAccessToken = '' }, expirationTime * 1000);
            // Clear access token from address bar.
            window.history.pushState('Access Token', null, '/');
            if (userAccessToken) {
                return userAccessToken;
            };
        } else {
            // Return if no token found is in address bar.
            return;
        }
    },

    getAccessToken() {
        if (userAccessToken) {
            // Return it if a valid token already exists.
            return userAccessToken;
            /* } else if (this.saveAccessToken()) {
                // Might be redundant.
                 return userAccessToken; */
        } else {
            // Redirect to spotify for authorization if no valid token already exist.
            const url = `https://accounts.spotify.com/authorize?response_type=${responseType}&client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}`;
            window.location = url;
        }
    },

    search(term) {
        // Get a valid token before performing search.
        let accessToken = this.getAccessToken();
        const headers = {
            'Authorization': tokenType + accessToken,
            'Content-Type': 'application/json'
        }

        if (accessToken) {
            let tracksQueryResponse = fetch(`https://api.spotify.com/v1/search?type=track&include_external=audio&q=${term}`, {
                'headers': headers
            }).then(response => {
                return response.json()
            }).then(jsonResponse => {
                if (jsonResponse.tracks.items) {
                    return jsonResponse.tracks.items.map(track => {
                        return {
                            'id': track.id,
                            'name': track.name,
                            'artist': track.artists.map(artist => artist.name).reduce(
                                (prevArtists, currentArtist) => `${prevArtists}, ${currentArtist}`),
                            'album': track.album.name,
                            'uri': track.uri,
                            'imageUrl': track.album.images[2].url
                        }
                    })
                }
            }).catch(error => console.error(error));
            return tracksQueryResponse;
        }
    },

    async savePlaylist(name, trackURIs) {
        if (!(name && trackURIs)) {
            return;
        }

        // Get a valid token before performing save.
        let accessToken = this.getAccessToken();
        const headers = {
            'Authorization': tokenType + accessToken,
            'Content-Type': 'application/json'
        }

        // Start playlist creation.
        //// Get user ID.
        console.log('Fetching user ID...')
        let userID = fetch('https://api.spotify.com/v1/me', {
            'headers': headers
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            return jsonResponse.id;
        }).catch(error => console.error(error));
        ////// Await and save user ID.
        let currentUserID = await userID;
        console.log(`Current user\nID: ${currentUserID}`);

        //// Create a new empty playlist with userID
        console.log('Creating playlist for user...');
        let playlistID = fetch(`https://api.spotify.com/v1/users/${currentUserID}/playlists`, {
            'method': 'POST',
            'headers': headers,
            'body': JSON.stringify({
                'name': name,
                'description': 'Made with Jammming'
            })
        }).then(response => {
            return response.json()
        }).then(jsonResponse => {
            return jsonResponse['id'];
        }).catch(error => console.error(error));
        ////// Await and save playlist ID.
        let currentPlaylistID = await playlistID;
        console.log(`Created playlist,\nID: ${currentPlaylistID}`);

        //// Add tracks to created playlist
        console.log('Adding tracks to playlist...');
        let snapshotID = fetch(`https://api.spotify.com/v1/playlists/${currentPlaylistID}/tracks`, {
            'method': 'POST',
            'headers': headers,
            'body': JSON.stringify({
                "uris": trackURIs,
                "position": 0
            })
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            return jsonResponse.snapshot_id;
        }).catch(error => console.error(error));
        ////// Await and save snapshot ID.
        let currentSnapshotID = await snapshotID;
        console.log(`Added ${trackURIs.length} tracks to playlist\nPlaylist ID: ${currentPlaylistID}, \n\nFor user\nUser ID: ${currentUserID}.\n\nThis change has a Snapshot ID: ${currentSnapshotID}`);

        // Return the snapshot ID.
        return currentSnapshotID;
    }
}
export default Spotify;