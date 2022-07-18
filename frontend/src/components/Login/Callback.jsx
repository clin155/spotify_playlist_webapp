import React from "react";
import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import { Navigate } from "react-router-dom";

export function Callback(props) {
    // const [accessToken, setAccessToken] = useState()
    const [returnElement, setReturnElement] = useState(<div></div>);
    const code = new URLSearchParams(window.location.search).get("code");
    const [accessToken,error] = useAuth(code);
    const { setLoggedIn, setAccessToken } = props;
    useEffect(() => {

        if (error || !code) {
            setReturnElement(<Navigate to="/login"/>);
        }
        else if (accessToken) {
            setLoggedIn(true)
            setAccessToken(accessToken)
            setReturnElement(<Navigate to="/"/>);

        }

    }, [accessToken,setAccessToken, setLoggedIn, error, code])

    return returnElement

}