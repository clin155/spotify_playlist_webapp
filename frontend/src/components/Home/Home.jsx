import { Playlists } from "./../Playlist"

export function Home(props) {
    return (
        <div className="flexor-container">
            <Playlists className="box" token={props.accessToken} />
            <div className="box">

            </div>
        </div>

    )
}