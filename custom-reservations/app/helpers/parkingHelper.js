const axios = require('axios');
const getLaunchEndTime = require('../helpers/launchTimeHelper');

module.exports = async function getFirstAvailablePlace(space, day, launchSlot, headers) {

  queryParams = {
    space_id: space,
    day: day + "T00:00:00.000Z"
  }

  query = new URLSearchParams(queryParams).toString();

  var r = await axios.get('https://api.nibol.co/v2/app/business/space/days-availability/map' + '?' + query, headers)

  var z = 0
  while (z < r.data.length && find != true) {
    var station = r.data[z]

    if (station.reservation_slots.length == 0) {
      var spaceId = station.id
      find = true
    } else {
      var i = 0
      var find = false

      while (i < station.reservation_slots.length) {
        var reservation_slot = station.reservation_slots[i]

        var start = reservation_slot.time.from
        var end = reservation_slot.time.to

        var actualStart = parseInt(launchSlot.replace(':', ''))
        var actualEnd = parseInt(getLaunchEndTime(launchSlot).replace(':', ''))
        if (actualEnd <= start || actualStart >= end) {
          var spaceId = station.id
          find = true
        } else {
          find = false
        }
        i++
      }

    }
    z++
  }
  return spaceId
}

