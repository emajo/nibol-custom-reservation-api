const spaceHelper = require('./spaceHelper')
const axios = require('axios');

module.exports = async function getDeskCodeFromName(space, day, deskName, headers) {

  queryParams = {
    space_id: space,
    day: day + "T00:00:00.000Z"
  }

  query = new URLSearchParams(queryParams).toString();

  var r = await axios.get('https://api.nibol.co/v2/app/business/space/days-availability/map' + '?' + query, headers)
  var deskComponents = deskName.split('.')
  var deskIndex = deskComponents[deskComponents.length - 1]
  var deskId = r.data[parseInt(deskIndex)].id
  return deskId

}
