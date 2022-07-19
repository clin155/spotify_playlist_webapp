import { Playlist } from "../Playlist/Playlist"
import Container from 'react-bootstrap/Container';

export function Home(props) {
    return (
        <Container>
            <Playlist token={props.accessToken} id={"53I4028XDadby8OrAhoSK2"}/>
        </Container>
    )
}