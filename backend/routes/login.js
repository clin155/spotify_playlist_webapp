const express = require('express');
const axios = require('axios');
const SpotifyWebApi = require('spotify-web-api-node');
const router = express.Router();
const User = require('../models/Users')



router.post('/', async function(req, res) {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.FRONTEND_URL + "/callback/",
      // redirectUri: process.env.GORK,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    })
    if (req.session.userid) {
      const tokenData = await spotifyApi.authorizationCodeGrant(code)
      res.json({
        accessToken: tokenData.body.access_token,
        refreshToken: tokenData.body.refresh_token,
        expiresIn: tokenData.body.expires_in,
        user: req.session.userid
      })
      return;
    }
    try {
      const tokenData = await spotifyApi.authorizationCodeGrant(code)
      const response = await axios.get("https://api.spotify.com/v1/me",
      {
        headers: { 'Authorization': `Bearer ${tokenData.body.access_token}` }
      })
      const emaill = response.data.email
      const docs = await User.findOne( { email:emaill } )
      let data = {}
      if (docs == null) {
        const user = new User({
          name: response.data.display_name,
          email: response.data.email
        })
        data = await user.save()

      } else if (req.session.userid && docs.email !== req.session.userid) {
        req.session.destroy();
        res.sendStatus(404);
        return;
      }
      let session=req.session;
      session.userid=emaill;
      res.json({
        accessToken: tokenData.body.access_token,
        refreshToken: tokenData.body.refresh_token,
        expiresIn: tokenData.body.expires_in,
        user: data
      })
    }
    catch(err) {
      console.log(err)
      if (err.message) {
        res.status(500).json(
          {error: err.message,
            redirectUri: process.env.FRONTEND_URL + "/callback/"
          })
      }
      else {
        res.status(400).json(err)
      }
    }

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

router.post('/logout/', function(req, res) {
  if (!req.session.userid) {
    res.sendStatus(404);
    return
  }
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(400).send('Unable to log out')
      } else {
        res.send('Logout successful')
      }
    });
  } else {
    res.end()
  }
})

module.exports = router