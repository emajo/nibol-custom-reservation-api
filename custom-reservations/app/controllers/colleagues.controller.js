const spaceHelper = require('../helpers/spaceHelper')
const nibolAuthHeadersHelper = require('../helpers/nibolAuthHeadersHelper');
const userHelper = require('../helpers/userHelper')
const axios = require('axios')

const FIC_SPACES = ['dev', 'cs', 'fix']

exports.list = async (req, res) => {
  try {
    const { days, space } = req.query

    var colleagues = []
    var headers = await nibolAuthHeadersHelper(req.user)

    await Promise.all(
      days.split(',').map(async day => {
        if (space === 'all')
          await Promise.all(FIC_SPACES.map(async s => {
            return colleagues.push({
              date: day,
              reservation: {
                space: s,
                colleagues: await listColleagues(s, day, headers)
              }
            })
          }))
        else
          colleagues.push({
            date: day,
            reservation: {
              space,
              colleagues: await listColleagues(space, day, headers)
            }
          })
      })
    )
    res.send({ colleagues })
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
