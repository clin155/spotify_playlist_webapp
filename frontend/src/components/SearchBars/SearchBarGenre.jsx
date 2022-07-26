import { Container, Form } from "react-bootstrap"

import { useState, useEffect } from "react";
import { Genre } from "./"
import axios from "axios";

export function SearchBarGenre(props) {
    const [ search, setSearch ] = useState("");
    const [ searchResult, setSearchResult ] = useState(() => [])
    const [ openDiv, setOpenDiv ] = useState(false)
    const [ width, setWidth ] = useState("auto");
    useEffect(() => {
      if (!props.token) return 

      axios.get("https://api.spotify.com/v1/recommendations/available-genre-seeds",
        {
          headers: { 'Authorization': `Bearer ${props.token}` }
        })
        .then((res) => {
          setSearchResult(sortGorker(res.data.genres))
          
        })
        .catch((err) => {
          console.log(err)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search===""]);


    useEffect(() => {
      setSearchResult((old) => sortGorker(old))
      if (search === "") {
        setOpenDiv(false)
        setWidth("auto")
      }  else {
        setOpenDiv(true)
        setWidth("140%")
      }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])
    
    function clearSearch(id, title) {
      props.addToQuery(id, title)
      setSearch("")
    }
    
    const sortGorker = (old) => {
      let neww = [...old].sort()
      const newwArr = []
      let ind = 0
      neww.forEach((val) => {
        if (val.startsWith(search)) {
          newwArr.splice(0, 0, val)
          ind++
        }
        else if (val.includes(search)) {
          newwArr.splice(ind, 0, val)
        }
        else {
          newwArr.splice(newwArr.length,0, val)
        }
      })
      return newwArr
    }
    return (
        <Container className="d-flex flex-column" style={{
          width: width
        }}>
        <Form.Control
            type="search"
            placeholder="Search Genres"
            value={search}
            onChange={e => setSearch(e.target.value)}
        />
        {openDiv &&
          <div className="searchResults" style={{
            overflowY: 'scroll'
          }}>
            {searchResult.map((search) => <Genre 
              clearSearch = {clearSearch}
              search={search}
            />)}
          </div>
        }
        </Container>
    )
}