const spaceHelper = require('../helpers/spaceHelper')
const nibolAuthHeadersHelper = require('../helpers/nibolAuthHeadersHelper');
const axios = require('axios')
const db = require("../models");
const User = db.users;

const FIC_SPACES = ['dev', 'cs', 'fix']

exports.list = async (req, res) => {
  try {
    const { days, space, sort } = req.query
    console.log(sort)
    const headers = await nibolAuthHeadersHelper(req.user)
    const myId = await User.findOne({ attributes: ['nibol_id'], where: { email: req.user }, raw: true })

    let info = []
    await Promise.all(days.split(',').map(async day =>
      info.push({
        date: day,
        reservation: space === 'all'
          ? await Promise.all(FIC_SPACES.map(async s => getSpace(s, day, headers, myId)))
          : getSpace(space, day, headers)
      })
    ))
    info.sort((a, b) => a.date > b.date ? 1 : -1)
    res.send({ info })
  } catch (e) {
    res.status(500).send({ message: e.message ?? "Some error occurred." });
  };
}

async function getSpace(space, day, headers, myId) {
  return {
    space,
    colleagues: await listColleagues(space, day, headers, myId)
  }
}

async function listColleagues(space, day, headers, myId) {
  query = new URLSearchParams({
    space_id: spaceHelper(space),
    day: `${day}T00:00:00.000Z`
  }).toString();

  try {
    const response = await axios.get(`${process.env.NIBOL_URL}/space/days-availability/map?${query}`, headers)

    colleagues = []
    response.data.map(({ reservation_slots }) =>
      reservation_slots.map(({ user: { id, name, pic } }) => {
        if (!!name && !!id && id !== myId.nibol_id)
          colleagues.push({ name, pic })
      }))

    return colleagues.sort((a, b) => a.name.localeCompare(b.name))
  } catch (e) {
    throw Error(e.message ?? "Some error occurred.")
  }
}
