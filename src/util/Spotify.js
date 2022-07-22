let userAccessToken = '';
let expirationTime = '';
let tokenType = 'Bearer ';

const clientID = '45ef46e4eacf447d8ef2a68da2aa6dc2';
const redirectURI = 'http://localhost:3000';
const scope = 'playlist-modify-private, playlist-modify-public';
const responseType = 'token';


const Spotify = {
    saveAccessToken() {
        console.log('saveAccessToken running');
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            userAccessToken = accessTokenMatch[1];
            expirationTime = Number(expiresInMatch[1]);
            window.setTimeout(() => { userAccessToken = '' }, expirationTime * 1000);
            window.history.pushState('Access Token', null, '/');
            if (userAccessToken) {
                console.log('saveAccessToken ran: token found and saved from address bar, returning it');
                return userAccessToken;
            };
        } else {
            console.log('saveAccessToken ran: no token found  in address, returning');
            return;
        }
    },

    getAccessToken() {
        if (userAccessToken) {
            console.log('existing token found, returning it');
            return userAccessToken;
        } else if (this.saveAccessToken()) {
            return userAccessToken;
        } else {
            console.log('no token, redirecting to spotify for authorization');
            const url = `https://accounts.spotify.com/authorize?response_type=${responseType}&client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}`;
            window.location = url;
        }
    },

    search(term) {
        console.log('search running');
        let accessToken = this.getAccessToken();
        const headers = {
            'Authorization': tokenType + accessToken,
            'Content-Type': 'application/json'
        }

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
    },

    savePlaylist(name, trackURIs) {
        if (!(name && trackURIs)) {
            return;
        }
        let accessToken = this.getAccessToken();
        const headers = {
            'Authorization': tokenType + accessToken,
            'Content-Type': 'application/json'
        }

        let userID;
        let playlistID;
        fetch('https://api.spotify.com/v1/me', {
            'headers': headers
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            userID = jsonResponse.id;
        });

        console.log('user id is: ' + userID);

        fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            'method': 'POST',
            'headers': headers,
            'body': JSON.stringify({
                'name': name,
                'description': 'Made with Jammming'
            })
        }).then(response => {
            // console.log(response);
            return response.json()
        }).then(jsonResponse => {
            playlistID = jsonResponse['id'];
        })
        // console.log('created playlist id is: ' + playlistID);

        fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
            'method': 'POST',
            'headers': headers,
            'data': {
                "uris": trackURIs,
                "position": 0
            }
        })
        /*.then(() => console.log(`added ${trackURIs.length} tracks succesfully`))
     
        console.log('playlist saved as ' + playlistID);*/
    }
}
export default Spotify;