
'use strict'

let fmt = require('logfmt')
let db = require('./models')
let q = require('./lib/queue')
let request = require('request')
let config = require('./config')
let getValidToken = require('./lib/token')
let Casey = require('lib/casey')

q.process('personalized-playlist', personalizedPlaylist)


function personalizedPlaylist(job, ctx, done) {
  db.Account.findOne({ })
  .then((acct) => {

    if ( !acct || !acct.get('playlist_id') ) {
      let err = new Error(`No account and/or playlist found, have you auth'd with Spotify?`)
      fmt.log({ type: 'warning', msg: err })
      done(err)
      pauseWorker(ctx)
      return
    }

    getValidToken(acct)
    .then((token)  => {
      const commonOpts = { auth: { 'bearer': token }, json: true }


      // get tracks recommendations with spotify track id as seed (10 songs, min popularity = 50, US market)
      const trackId = _.last(job.data.track.uri.split(':'))
      const getRecommendationsURL = 'https://api.spotify.com/v1/recommendations'
      const recommendationsOpts = Object.assign({
        qs: {
          seed_tracks: trackId,
          min_popularity: 50,
          limit: 10,
          market: 'US'
        }
      }, commonOpts)
      request.get(getRecommendationsURL, recommendationsOpts, (err, res, body) => {
        if (err || res.statusCode ==! 200) {
          fmt.log({
            type: 'error',
            msg: err.message || res.statusCode
          })
          done(err.message || res.statusCode)
          return
        }

        const tracks = _.map(body.tracks, 'uri')


        // create a playlist
        const createPlaylistURL = `https://api.spotify.com/v1/users/${acct.get('id')}/playlists`
        const createPlaylistOpts = Object.assign({
          body: {
            name: 'Dreamhouse Disco (built with 💜 by Heroku)',
            public: true
          }
        }, commonOpts)
        request.post(createPlaylistURL, createPlaylistOpts, (err, res, body) => {
          if (err || res.statusCode ==! 200) {
            fmt.log({
              type: 'error',
              msg: err.message || res.statusCode
            })
            done(err.message || res.statusCode)
            return
          }

          const playlistUri = body.uri


          // add songs to playlist
          const addSongsToPlaylistURL = body.tracks.href
          const addSongsToPlaylistOpts = Object.assign({
            uris: tracks
          }, commonOpts)
          request.post(addSongsToPlaylistURL, addSongsToPlaylistOpts, (err, res, body) => {
            if (err || res.statusCode ==! 200) {
              fmt.log({
                type: 'error',
                msg: err.message || res.statusCode
              })
              done(err.message || res.statusCode)
              return
            }

            // send playlist uri and seed track object to casey (to be embedded in spotify play button iframe player)
            Casey.setPlaylistFor(job.data.shortCode, playlistUri, job.data.track)
            .then( () => done() )
            .catch(err => {
              fmt.log({
                type: 'error',
                msg: `Error setting playlist with Casey: ${err}`
              })
              done(err)
            })
          })
        })
      })

    })
  })
}
