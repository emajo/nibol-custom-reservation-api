const spaceHelper = require('../helpers/spaceHelper')
const nibolAuthHeadersHelper = require('../helpers/nibolAuthHeadersHelper');
const axios = require('axios')
const db = require("../models");
const User = db.users;

const FIC_SPACES = ['dev', 'cs', 'fix']

exports.list = async (req, res) => {
  try {
    const { days, space } = req.query

    var myId = await User.findOne({ attributes: ['nibol_id'], where: { email: req.user }, raw: true })

    var colleagues = {}
    var headers = await nibolAuthHeadersHelper(req.user)

    await Promise.all(
      days.split(',').map(async day => {
        colleagues[day] = {}
        if (space === 'all')
          await Promise.all(FIC_SPACES.map(async s => colleagues[day][s] = await listColleagues(s, day, headers, myId)))
        else
          colleagues[day] = await listColleagues(req.query.space, day, headers, myId)
      })
    )
    res.send({ colleagues })
  } catch (e) {
    res.status(500).send({ message: e.message ?? "Some error occurred." });
  };
}

async function listColleagues(space, day, headers, myId) {
  query = new URLSearchParams({
    space_id: spaceHelper(space),
    day: `${day}T00:00:00.000Z`
  }).toString();

  try {
    var response = await axios.get(`https://api.nibol.co/v2/app/business/space/days-availability/map?${query}`, headers)

    colleaguesInOffice = []

    response.data.map(({ reservation_slots }) => {
      reservation_slots.forEach(function (reservation_slot) {
        if (reservation_slot?.user?.id && reservation_slot?.user?.id != myId) {
          colleaguesInOffice.push({ name: reservation_slot.user.name, picture: reservation_slot.user.pic })
        }
      })
    })

    return colleaguesInOffice.sort((a, b) => a.name.localeCompare(b.name))
  } catch (e) {
    throw Error(e.message ?? "Some error occurred.")
  }
}
