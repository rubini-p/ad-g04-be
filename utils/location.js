const axios = require('axios');
const zlib = require('zlib');
const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyCkzDuIS-HG6cp8wP7p05CzbzGMKtfJTMI';

async function getCoordsForAddress(address) {
  // return {
  //   lat: 40.7484474,
  //   lng: -73.9871516
  // };
  const config = {
    headers: {
      'Accept-Encoding': ''
    }
  };
  const response = await axios.get(    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`, config );

  const data = response.data ;

  if (!data || data.status === 'ZERO_RESULTS') {
    let coordinates = { lat: 0, lng: 0 }
    return coordinates;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
