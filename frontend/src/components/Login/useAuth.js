import { useState, useEffect } from 'react';

import axios from 'axios';

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState(undefined)
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()
    const [error, setError] = useState(false)

    useEffect(() => {
      if (code) {
        const instance = axios.create({
          withCredentials: true,
        })
        instance.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, { code })
          .then((res) => {
            if (res.status === 404) {
              window.location = "/login";
              return;
            }
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