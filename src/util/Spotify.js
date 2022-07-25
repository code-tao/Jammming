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

    savePlaylist(name, trackURIs) {
        if (!(name && trackURIs)) {
            return;
        }

        // Get a valid token before performing save.
        let accessToken = this.getAccessToken();
        const headers = {
            'Authorization': tokenType + accessToken,
            'Content-Type': 'application/json'
        }

        let userID;
        let playlistID;
        let snapshotID;
        // Start playlist creation.
        // Get user ID.
        console.log('fetching user ID...')
        let playlistSaveResponse = fetch('https://api.spotify.com/v1/me', {
            'headers': headers
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            userID = jsonResponse.id;
            console.log('authorized user ID is ' + userID);
            return userID;
        }).then(userID => {
            console.log('Now creating playlist for user ' + userID);

            // Create a new empty playlist with userID
            fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                'method': 'POST',
                'headers': headers,
                'body': JSON.stringify({
                    'name': name,
                    'description': 'Made with Jammming'
                })
            }).then(response => {
                return response.json()
            }).then(jsonResponse => {
                playlistID = jsonResponse['id'];
                console.log('created playlist, playlist ID is: ' + playlistID);
                return playlistID;
            }).then(playlistID => {
                console.log('Now adding tracks to playlist ' + playlistID);

                // Add tracks to created playlist
                fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                    'method': 'POST',
                    'headers': headers,
                    'body': JSON.stringify({
                        "uris": trackURIs,
                        "position": 0
                    })
                }).then(response => {
                    return response.json();
                }).then(jsonResponse => {
                    snapshotID = jsonResponse.snapshot_id;
                    console.log(`Added ${trackURIs.length} songs to playlist saved as ${playlistID}. Snapshot ID: ${snapshotID}`);
                    return snapshotID;
                })
            });
        });
        return playlistSaveResponse;
    }
}
export default Spotify;