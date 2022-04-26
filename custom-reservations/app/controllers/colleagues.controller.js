const spaceHelper = require('../helpers/spaceHelper')
const nibolAuthHeadersHelper = require('../helpers/nibolAuthHeadersHelper');
const userHelper = require('../helpers/userHelper')
const axios = require('axios')

const FIC_SPACES = ['dev', 'cs', 'fix']

exports.list = async (req, res) => {
  try {
    const { days, space } = req.query
    const headers = await nibolAuthHeadersHelper(req.user)

    let info = []
    await Promise.all(days.split(',').map(async day => info.push({
      date: day,
      reservation: space === 'all'
        ? await Promise.all(
          FIC_SPACES.map(async s => ({
            space: s,
            colleagues: await listColleagues(s, day, headers)
          }))
        )
        : {
          space,
          colleagues: await listColleagues(space, day, headers)
        }
    })))
    res.send({ info })
  } catch ({ message }) {
    res.status(500).send({ message: message ?? "Some error occurred." });
  };
}

async function listColleagues(space, day, headers) {
  query = new URLSearchParams({
    space_id: spaceHelper(space),
    day: `${day}T00:00:00.000Z`
  }).toString();

  try {
    var response = await axios.get(`https://api.nibol.co/v2/app/business/space/days-availability/map?${query}`, headers)

    colleaguesInOffice = []

    response.data.map(({ reservation_slots }) => {
      reservation_slots.forEach(({ user: { name, pic: picture } }) => {
        colleaguesInOffice.push({ name, picture })
      })
    })

    return colleaguesInOffice.sort((a, b) => a.name.localeCompare(b.name))
  } catch ({ message }) {
    throw Error(message ?? "Some error occurred.")
  }
}
