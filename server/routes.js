'use strict';

const Spotify = require('spotify-web-api-node');
const querystring = require('querystring');
const express = require('express');
const config = require('./config');
const router = new express.Router();


const CLIENT_ID = config.spotifyData.CLIENT_ID;
const CLIENT_SECRET = config.spotifyData.CLIENT_SECRET;
const REDIRECT_URI = config.spotifyData.server[process.env.NODE_ENV] + config.spotifyData.REDIRECT_URI;
const STATE_KEY = 'spotify_auth_state';

const scopes = ['playlist-read-private', 'playlist-read-collaborative', 'user-read-private', 'user-read-email', 'user-read-currently-playing', 'user-read-playback-state', 'user-modify-playback-state'];

const spotifyApi = new Spotify({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI
});

const generateRandomString = N => (Math.random().toString(36)+Array(N).join('0')).slice(2, N+2);


router.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(STATE_KEY, state);
  res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
});


router.get('/callback', (req, res) => {
  const { code, state } = req.query;
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;
  if (state === null || state !== storedState) {
    res.redirect('/#/error/Error while sign in, try again');
  } else {
    res.clearCookie(STATE_KEY);
    spotifyApi.authorizationCodeGrant(code).then(data => {
      const { expires_in, access_token, refresh_token } = data.body;
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);
      res.redirect(`/#/success/${access_token}/${refresh_token}`);
    }).catch(err => {
      res.redirect('/#/error/Error while sign in, try again');
    });
  }
});

module.exports = router;
