const nibolAuthHeadersHelper = require('../helpers/nibolAuthHeadersHelper');
const axios = require('axios');

exports.list = async (req, res) => {

  try {
    axios.get('https://api.nibol.co/v2/app/business/reservation/calendar', await nibolAuthHeadersHelper(req.user))
      .then(function (r) {
        var reservations = {}
        r.data.map(function (reservation) {
          if (reservation?.status != "cancelled") {

            var rv = {
              start: reservation.start,
              end: reservation.end,
              space: reservation.space.name
            }

            var day = rv.start.split("T")[0]

            if ([day] in reservations) {
              reservations[day].push(rv)
            } else {
              reservations[day] = [rv]
            }
          }
        })
        res.send({ reservations: reservations })
      })
      .catch(function (error) {
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