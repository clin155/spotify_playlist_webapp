import { Container, Form } from "react-bootstrap"

import { useState, useEffect } from "react";
import { Song } from "../Song"
import uuid from "react-uuid";

export function SearchBar(props) {
    const [ search, setSearch ] = useState("");
    const [ searchResult, setSearchResult ] = useState(() => []);
    // const [ height, setHeight ]= useState(0);
    const [ openDiv, setOpenDiv ] = useState(false)
    
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
                id: track.id,
              }
            })
          )
        })
    
        return () => (cancel = true)
    }, [props.token, search, props.spotifyApi]);


    useEffect(() => {
      search === "" ? setOpenDiv(false) : setOpenDiv(true)

    }, [search])
    function playSong(i) {
      const newArr = searchResult.map((track) => {
        return {
          uri: track.uri,
          id: track.id,
        }
      })
        
      props.setPlayingSongs(newArr)
      props.setPlayingOffset(i)

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
        <Container className="d-flex flex-column gorkers">
        <Form.Control
            type="search"
            placeholder="Search Songs/Artists"
            value={search}
            onChange={e => setSearch(e.target.value)}
        />
        {openDiv &&      
          <div className="searchResults">
              {searchResult.map((track, i) => (
                  <Song 
                  artist={track.artist}
                  title={track.title}
                  albumUrl={track.albumUrl}
                  playlistId={props.playlistId}
                  setTracksWrapper={props.setTracksWrapper}
                  editing={false}
                  songInd={i}
                  uri={track.uri}
                  onPlaylist={false}
                  playSong={() => playSong(i)}
                  setSearch={setSearch}
                  key={uuid()}
                  addToBank={() => addToBank(i)}
                  id={track.id}
                  />
              ))}
          </div>
        }
        </Container>
    )
}