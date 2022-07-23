import { Container, Form } from "react-bootstrap"

import { useState, useEffect } from "react";
import { Song } from "../Song"

export function SearchBar(props) {
    const [ search, setSearch ] = useState("");
    const [ searchResult, setSearchResult ] = useState(() => [])
    const [ height, setHeight ]= useState(0)
    useEffect(() => {
        if (!search) return setSearchResult([]);
        if (!props.token) return 

        let cancel = false
        props.spotifyApi.searchTracks(search).then(res => {
          if (cancel) return
          setSearchResult(
            res.body.tracks.items.map(track => {
              const smallestAlbumImage = track.album.images.reduce(
                (smallest, image) => {
                  if (image.height < smallest.height) return image
                  return smallest
                },
                track.album.images[0]
              )
    
              return {
                artist: track.artists[0].name,
                title: track.name,
                uri: track.uri,
                albumUrl: smallestAlbumImage.url,
              }
            })
          )
        })
    
        return () => (cancel = true)
    }, [props.token, search, props.spotifyApi]);


    useEffect(() => {
      search === "" ? setHeight(20) : setHeight(600)

    }, [search])

    return (
        <Container className="d-flex flex-column gorkers">
        <Form.Control
            type="search"
            placeholder="Search Songs/Artists"
            value={search}
            onChange={e => setSearch(e.target.value)}
        />
        <div className="searchResults" style={{
          height: height
        }}>
            {searchResult.map(track => (
                <Song 
                artist={track.artist}
                title={track.title}
                albumUrl={track.albumUrl}
                playlistId={props.playlistId}
                setTracksWrapper={props.setTracksWrapper}
                />
            ))}
        </div>
        </Container>
    )
}