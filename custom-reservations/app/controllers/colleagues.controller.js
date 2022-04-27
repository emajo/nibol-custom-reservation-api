const spaceHelper = require('../helpers/spaceHelper')
const nibolAuthHeadersHelper = require('../helpers/nibolAuthHeadersHelper');
const userHelper = require('../helpers/userHelper')
const axios = require('axios')

const FIC_SPACES = ['dev', 'cs', 'fix']

exports.list = async ({ query, user }, res) => {
  try {
    const { days, space } = query
    const headers = await nibolAuthHeadersHelper(user)

    let info = []
    await Promise.all(days.split(',').map(async day =>
      info.push({
        date: day,
        reservation: space === 'all'
          ? await Promise.all(FIC_SPACES.map(async s => getSpace(s, day, headers)))
          : getSpace(space, day, headers)
      })
    ))
    res.send({ info })
  } catch ({ message }) {
    res.status(500).send({ message: message ?? "Some error occurred." });
  };
}

async function getSpace(space, day, headers) {
  return {
    space,
    colleagues: await listColleagues(s, day, headers)
  }
}

async function listColleagues(space, day, headers) {
  query = new URLSearchParams({
    space_id: spaceHelper(space),
    day: `${day}T00:00:00.000Z`
  }).toString();

  try {
    const response = await axios.get(`${process.env.NIBOL_URL}/space/days-availability/map?${query}`, headers)

    colleagues = []
    response.data.map(({ reservation_slots }) =>
      reservation_slots.map(({ user: { name, pic } }) =>
        colleagues.push({ name, pic })
      ))

    return colleagues.sort((a, b) => a.name.localeCompare(b.name))
  } catch ({ message }) {
    throw Error(message ?? "Some error occurred.")
  }
}
