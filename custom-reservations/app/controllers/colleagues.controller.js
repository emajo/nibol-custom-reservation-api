const spaceHelper = require('../helpers/spaceHelper')
const nibolAuthHeadersHelper = require('../helpers/nibolAuthHeadersHelper');
const axios = require('axios')
const db = require("../models");
const User = db.users;

const FIC_SPACES = ['dev', 'cs', 'fix']

exports.list = async ({ query, user }, res) => {
  try {
    const { days, space } = query
    const headers = await nibolAuthHeadersHelper(user)
    const myId = await User.findOne({ attributes: ['nibol_id'], where: { email: user }, raw: true })

    let info = []
    await Promise.all(days.split(',').map(async day =>
      info.push({
        date: day,
        reservation: space === 'all'
          ? await Promise.all(FIC_SPACES.map(async s => getSpace(s, day, headers, myId)))
          : getSpace(space, day, headers)
      })
    ))
    res.send({ info })
  } catch ({ message }) {
    res.status(500).send({ message: message ?? "Some error occurred." });
  };
}

async function getSpace(space, day, headers, myId) {
  return {
    space,
    colleagues: await listColleagues(s, day, headers, myId)
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
  } catch ({ message }) {
    throw Error(message ?? "Some error occurred.")
  }
}
