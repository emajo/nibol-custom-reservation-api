const nibolAuthHeadersHelper = require('../helpers/nibolAuthHeadersHelper');
const spaceHelper = require('../helpers/spaceHelper');
const getDeskCodeFromName = require('../helpers/deskHelper');
const getFirstAvailablePlace = require('../helpers/parkingHelper');
const getLaunchEndTime = require('../helpers/launchTimeHelper');
const axios = require('axios');
const db = require("../models");
const User = db.users;

exports.list = async (req, res) => {

  try {
    axios.get('https://api.nibol.co/v2/app/business/reservation/calendar', await nibolAuthHeadersHelper(req.user))
      .then(r => {
        var reservations = {}
        r.data.map(reservation => {

          var startDate = reservation?.start.split('T')[0]

          if (reservation?.status != "cancelled" && (startDate >= req.query.start && startDate <= req.query.end)) {

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

exports.create = async (req, res) => {

  var headers = await nibolAuthHeadersHelper(req.user)
  User.findOne({ where: { email: req.user } })
    .then(async queryRes => {
      if (req.body.type == "desk") {
        var type = "desk"
        var space = spaceHelper(queryRes.role)
        var deskCode = await getDeskCodeFromName(space, req.body.day, queryRes.default_desk, headers)

        var reqBody = {
          start: req.body.day + "T08:00:00.000Z",
          end: req.body.day + "T18:00:00.000Z",
          desk_id: deskCode,
          space_id: space
        }

      } else if (req.body.type == "launch") {
        var type = "parking"
        var space = spaceHelper("mensa")
        var deskCode = await getFirstAvailablePlace(space, req.body.day, queryRes.launch_slot, headers)

        var reqBody = {
          start: req.body.day + "T" + queryRes.launch_slot + ":00.000Z",
          end: req.body.day + "T" + getLaunchEndTime(queryRes.launch_slot) + ":00.000Z",
          parking_id: deskCode,
          space_id: space
        }
      }

      axios.post('https://api.nibol.co/v2/app/business/reservation/' + type + '/create', reqBody, headers)
        .then(result => {
          if (result.status == 200) {
            res.send({ success: true })
          } else {
            res.status(500).send({
              message:
                err.message || "Could not create a reservation."
            })
          }
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Could not create a reservation."
          })
        });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred."
      });
    });
}