import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InfiniteScroll from 'react-infinite-scroll-component';

function Playlist() {
    return (
        <Container>
            <InfiniteScroll 
                dataLength={items.length}
            >
                
            </InfiniteScroll>
        </Container>
    )
}