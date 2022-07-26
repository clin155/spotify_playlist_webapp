import { useEffect } from "react";
import axios from "axios";
import { BankSong } from "./";
import uuid from "react-uuid";

export function SongBank(props) {
    
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/bank/`, {
            withCredentials: true,
        })
            .then((response) => {
              props.setBanksongs(response.data.bank)  
            })
            .catch((error) => {
                console.log(error)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function deleteSong(ind) {
        const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/bank/${ind}`, {
            withCredentials: true,
        })
        if (res.status === 204) {
            props.setBanksongs(prev => {
                const newArr = [...prev]
                newArr.splice(ind, 1)
    
                return newArr
            })
        }
    }

    function playSong(i) {
        const newArr = props.banksongs.map((track) => {
          return {
            uri: track.uri,
            id: track.id,
          }
        })
        props.setPlayingOffset(i)
        props.setPlayingSongs(newArr)
  
    }
    function addSong(id, title) {
        props.setSeeds(old => [...old, {"id": id, "song": title}])
    }
    return (
        <div className="bankdiv">
            {props.banksongs.map((song, ind) => {
                return (
                    <BankSong 
                    artist={song.artist}
                    title={song.title}
                    albumUrl={song.albumUrl}
                    uri={song.uri}
                    editing={props.editing}
                    playlistId={props.playlistId}
                    setTracksWrapper={props.setTracksWrapper}
                    deleteSong={() => {
                        deleteSong(ind)
                    }}
                    playSong={() => playSong(ind)}
                    onGenerate={props.isGenerating}
                    addToGenerate={() => addSong(song.id, song.title)}
                    id={song.id}
                    key={uuid()}
                />
                )
            })}
        </div>
    )
}