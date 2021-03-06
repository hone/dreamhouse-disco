
'use strict'

var db = require('../models')

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Track', {
    key: { type: DataTypes.STRING, unique: true },
    album: DataTypes.STRING,
    albumArtist: DataTypes.STRING,
    albumArtistKey: DataTypes.STRING,
    albumKey: DataTypes.STRING,
    albumUrl: DataTypes.STRING,
    artist: DataTypes.STRING,
    artistKey: DataTypes.STRING,
    artistUrl: DataTypes.STRING,
    baseIcon: DataTypes.STRING,
    canDownload: DataTypes.BOOLEAN,
    canDownloadAlbumOnly: DataTypes.BOOLEAN,
    canSample: DataTypes.BOOLEAN,
    canStream: DataTypes.BOOLEAN,
    canTether: DataTypes.BOOLEAN,
    duration: DataTypes.INTEGER,
    embedUrl: DataTypes.STRING,
    gridIcon: DataTypes.STRING,
    icon: DataTypes.STRING,
    icon400: DataTypes.STRING,
    isClean: DataTypes.BOOLEAN,
    isExplicit: DataTypes.BOOLEAN,
    radio: DataTypes.JSONB,
    length: DataTypes.INTEGER,
    name: DataTypes.STRING,
    price: DataTypes.STRING,
    radioKey: DataTypes.STRING,
    shortUrl: DataTypes.STRING,
    trackNum: DataTypes.INTEGER,
    type: DataTypes.ENUM('t'),
    url: DataTypes.STRING,
    sampleUrl: DataTypes.STRING,
    isInCollection: DataTypes.BOOLEAN,
    isOnCompilation: DataTypes.BOOLEAN,
    isrcs: DataTypes.STRING,
    tetherRegions: DataTypes.STRING,
    iframeUrl: DataTypes.STRING,
    streamRegions: DataTypes.STRING,
    playCount: DataTypes.INTEGER,
    bigIcon: DataTypes.STRING,
    iconKey: DataTypes.STRING,
    dominantColor: DataTypes.STRING,
  })
}