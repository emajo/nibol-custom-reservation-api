const spaceHelper = require('../helpers/spaceHelper')
const nibolAuthHeadersHelper = require('../helpers/nibolAuthHeadersHelper');
const userHelper = require('../helpers/userHelper')
const axios = require('axios')

exports.list = async (req, res) => {
  try {
    var colleagues = {}
    var headers = await nibolAuthHeadersHelper(req.user)
    var myId = await userHelper(headers, 'id')

    var days = req.query.days.split(',')

    await Promise.all(
      days.map(async d => {
        colleagues[d] = {}
        if (req.query.space == 'all') {
          var spaces = ['dev', 'cs', 'fix']
          await Promise.all(
            spaces.map(async s => {
              colleagues[d][s] = await listColleagues(s, d, headers, myId)
            })
          )
        } else {
          colleagues[d] = await listColleagues(req.query.space, d, headers, myId)
        }
      })
    )

    res.send({ colleagues: colleagues })
  } catch (e) {
    res.status(500).send({
      message:
        e.message || "Some error occurred."
    });

  };
}

async function listColleagues(space, day, headers, myId) {
  var queryParams = {
    space_id: spaceHelper(space),
    day: day + "T00:00:00.000Z"
  }
  query = new URLSearchParams(queryParams).toString();

  try {
    var r = await axios.get('https://api.nibol.co/v2/app/business/space/days-availability/map' + '?' + query, headers)

    colleaguesInOffice = []
    r.data.map(function (station) {
      station?.reservation_slots.forEach(function (reservation_slot) {
        if (reservation_slot?.user?.id && reservation_slot?.user?.id != myId) {
          colleaguesInOffice.push({ name: reservation_slot.user.name, picture: reservation_slot.user.pic })
        }
      })
    })
    colleaguesInOffice.sort((a, b) => a.name.localeCompare(b.name))
    return (colleaguesInOffice)

  } catch (e) {
    throw Error(e.message || "Some error occurred.")
  }
}
