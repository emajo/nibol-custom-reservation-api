const spaceHelper = require('../helpers/spaceHelper')
const nibolAuthHeadersHelper = require('../helpers/nibolAuthHeadersHelper');
const axios = require('axios')

exports.list = async (req, res) => {

  queryParams = {
    space_id: spaceHelper(req.query.space),
    day: req.query.day + "T00:00:00.000Z"
  }

  query = new URLSearchParams(queryParams).toString();
  try {
    axios.get('https://api.nibol.co/v2/app/business/space/days-availability/map' + '?' + query, await nibolAuthHeadersHelper(req.user))
      .then(r => {
        colleaguesInOffice = []
        r.data.map(function (station) {
          station?.reservation_slots.forEach(function (reservation_slot) {
            if (reservation_slot?.user?.name) {
              colleaguesInOffice.push({name: reservation_slot.user.name, picture: reservation_slot.user.pic})
            }
          })
        })
        colleaguesInOffice.sort((a, b) => a.name.localeCompare(b.name))
        res.send({ colleagues: colleaguesInOffice })
      })
      .catch(error => {
        res.status(500).send({
          message:
            error.message || "Some error occurred."
        });
      })
  } catch (e) {
    res.status(500).send({
      message:
        e.message || "Some error occurred."
    });
  }

};