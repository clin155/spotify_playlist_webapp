import { Container, Form } from "react-bootstrap"

import { useState, useEffect } from "react";
import { Artist } from "./"
import uuid from "react-uuid";

export function SearchBarArtist(props) {
    const [ search, setSearch ] = useState("");
    const [ searchResult, setSearchResult ] = useState(() => [])
    const [ width, setWidth ] = useState("auto");
    const [ openDiv, setOpenDiv ] = useState(false)

    useEffect(() => {
        if (!search) return setSearchResult([]);
        if (!props.token) return 

        let cancel = false
        props.spotifyApi.searchArtists(search).then(res => {
          if (cancel) return
          setSearchResult(
            res.body.artists.items.map(val => {
              const smallestImg = val.images.reduce(
                (smallest, image) => {
                  if (image.height < smallest.height) return image
                  return smallest
                },
                val.images[0]
              )
    
              return {
                artist: val.name,
                ext_url: val.external_urls.spotify,
                imgUrl: smallestImg.url || res.body.artists.images[0]["url"],
                id: val.id,
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
    return (
        <Container className="d-flex flex-column" style={{
          width: width
        }}>
        <Form.Control
            type="search"
            placeholder="Search Artists"
            value={search}
            onChange={e => setSearch(e.target.value)}
        />
        {openDiv && 
          <div className="searchResults">
            {searchResult.map((track, i) => (
                <Artist 
                artist={track.artist}
                ext_url={track.ext_url}
                imgUrl={track.imgUrl}
                id={track.id}
                addToQuery={clearSearch}
                key={uuid()}
                />
            ))}
          </div>
          }

        </Container>
    )
}