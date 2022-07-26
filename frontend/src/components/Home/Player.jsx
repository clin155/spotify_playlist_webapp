import axios from 'axios';
import { useState, useEffect } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';


export function Player(props) {
    const [play, setPlay ] = useState(false);
    const [ numLeft, setNumLeft ] = useState(0);

    useEffect(() => {
        if (numLeft === 0 && props.playingSongs.length > 0) {
            const gorker = props.playingSongs.slice(0, 5);
            let retString = ""
            gorker.forEach((gork) => {
                retString += gork.id + ","
            })
            const params = new URLSearchParams({
                seed_tracks: retString.slice(0, -1),
                limit: 80
            })
                var cancel=false;
                axios.get("https://api.spotify.com/v1/recommendations?" + params, {
                    headers: { 'Authorization': `Bearer ${props.token}` }
                })
                    .then(res => {
                        if (cancel) return
                        if (res.status === 200) {
                            const tracks = res.data.tracks.map(track => {
                                return {
                                    uri: track.uri,
                                    id: track.id
                                }
                            });
                            console.log("added a gork")
                            props.setPlayingSongs(prev => [...prev, ...tracks])
                            setNumLeft(tracks.length)
                        }
                    })
            }

            return () => (cancel = true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props.playingSongs, numLeft, play])

    useEffect(() => {
        if (props.playingSongs.length > 0) {
            setPlay(true);
        }

    }, [props.playingSongs]);
    return (
        <div className="player">
            <SpotifyPlayer
            token={props.token}
            uris={props.playingSongs.map(track => track.uri)}
            callback={(state) => {
                setNumLeft(state.nextTracks.length)
                if (!state.isPlaying) {
                    setPlay(false);
                }
            }}
            offset={props.offset}
            showSaveIcon={true}
            play={play}
            magnifySliderOnHover={true}
            syncExternalDevice={true}
            />;
        </div>
    )
}