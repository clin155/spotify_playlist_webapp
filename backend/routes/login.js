const express = require('express');
const axios = require('axios');
const SpotifyWebApi = require('spotify-web-api-node');
const router = express.Router();

const User = require('../models/Users')

router.post('/', function(req, res) {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.FRONTEND_URL,
      // redirectUri: process.env.GORK,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    })
  
    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        let session=req.session;
        session.userid=req.body.username;
        return [axios.get("https://api.spotify.com/v1/me",
        {
          headers: { 'Authorization': `Bearer ${data.body.access_token}` }
        }), data]
      })
      .then((data) => {
        const [ newData, oldData ] = data
        const user = new User({
          name: newData.display_name,
          email: newData.email
        })
        return [user.save(), oldData]
      })
      .then((data) => {
        const [ newData, oldData ] = data
        res.json({
          accessToken: oldData.body.access_token,
          refreshToken: oldData.body.refresh_token,
          expiresIn: oldData.body.expires_in,
          user: newData
        })
      }) 
      .catch(err => {
        console.log(err)
        if (err.message) {
          res.status(400).json({error: err.message})
        }
        else {
          res.status(400).json(err)
        }
      })
});

router.get('/', function(req, res) {
  let session=req.session;
  if(session.userid){
    res.json({
      loggedIn: true
    })
  }
  else {
    res.json({
      loggedIn: false
    })
  }
})


module.exports = router