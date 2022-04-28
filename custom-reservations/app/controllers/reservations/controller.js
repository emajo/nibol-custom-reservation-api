const nibolAuthHeadersHelper = require('../../helpers/nibolAuthHeadersHelper');
const spaceHelper = require('../../helpers/spaceHelper');
const getDeskCodeFromName = require('../../helpers/deskHelper');
const getFirstAvailablePlace = require('../../helpers/parkingHelper');
const getLaunchEndTime = require('../../helpers/launchTimeHelper');
const axios = require('axios');
const db = require("../../models");
const { getResponseDate, getResponseReservation, alreadyExist } = require('./_utils');
const User = db.users;

exports.list = async (req, res) => {
  let info = []

  try {
    axios.get(
      `${process.env.NIBOL_URL}/reservation/calendar`,
      await nibolAuthHeadersHelper(req.user)
    ).then(responses => {
      responses.data.map(response => {
        if (response?.status === 'cancelled')
          return

        const date = getResponseDate(response)
        if (date < req.query.start || date > req.query.end)
          return

        !!alreadyExist(info, date)
          ? info.map(item => item.date === date
            ? item.reservations.push({ ...getResponseReservation(response) })
            : item
          )
          : info.push({ date, reservations: [{ ...getResponseReservation(response) }] })
      })
      res.send({ info })
    }).catch(
      error => res.status(500).send({ message: error.message || "Some error occurred." })
    )
  } catch (e) {
    res.status(500).send({
      message: e.message || "Some error occurred."
    })
  }
}

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

      axios.post(`${process.env.NIBOL_URL}/reservation/${type}/create`, reqBody, headers)
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
