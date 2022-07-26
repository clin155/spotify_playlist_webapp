import { Container, Form } from "react-bootstrap"

import { useState, useEffect } from "react";
import { Song } from "./"
import uuid from "react-uuid";

export function SearchBarSongs(props) {
    const [ search, setSearch ] = useState("");
    const [ searchResult, setSearchResult ] = useState(() => [])
    const [ openDiv, setOpenDiv ] = useState(false)
    const [ width, setWidth ] = useState("auto");
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
                albumUrl: smallestAlbumImage.url,
                id: track.id,
                uri: track.uri
              }
            })
          )
        })
    
        return () => (cancel = true)
    }, [props.token, search, props.spotifyApi]);


    useEffect(() => {
      if (search === "") {
        setOpenDiv(false)
        setWidth("auto")
      }  else {
        setOpenDiv(true)
        setWidth("140%")
      }

    }, [search])
    
    function clearSearch(id, title) {
      props.addToQuery(id, title)
      setSearch("")
    }
    
    function addToBank(ind) {
        props.setBankSongs(prev => {
          const newSong = {
              uri: searchResult[ind].uri,
              albumUrl: searchResult[ind].albumUrl,
              title: searchResult[ind].title,
              artist: searchResult[ind].artist,
              id: searchResult[ind].id
          }
          return [...prev, newSong]
        })
        props.setOpen(true)
    }

    return (
        <Container className="d-flex flex-column" style={{
          width: width
        }}>
        <Form.Control
            type="search"
            placeholder="Search Songs"
            value={search}
            onChange={e => setSearch(e.target.value)}
        />

        {openDiv && <div className="searchResults" style={{
            overflowY: 'scroll'
          }}>
              {searchResult.map((track, i) => (
                  <Song 
                  artist={track.artist}
                  title={track.title}
                  albumUrl={track.albumUrl}
                  id={track.id}
                  uri={track.uri}
                  addToQuery={clearSearch}
                  key={uuid()}
                  playSong={props.playSong}
                  addToBank={() => addToBank(i)}
                  />
              ))}
          </div>
        } 
        </Container>
    )
}