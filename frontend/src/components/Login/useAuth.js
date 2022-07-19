import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useAuth(code, setLoggedIn) {
    const [accessToken, setAccessToken] = useState(undefined)
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()
    const [error, setError] = useState(false)

    useEffect(() => {
      if (code) {
        axios.post("http://localhost:8000/login", {
          code
        })
          .then((res) => {
            setAccessToken(res.data.accessToken)
            setRefreshToken(res.data.refreshToken)
            setExpiresIn(res.data.expiresIn)
          })
          .catch((err) => {
            console.log(err)
            setError(true)
          })
      }
    }, [code])

    return [accessToken, error]
}