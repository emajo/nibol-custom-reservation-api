const axios = require('axios')
const userHelper = require('../../helpers/userHelper')
const db = require("../../models");
const User = db.users;

exports.setNibolToken = (req, res) => {
  saveNibolToken(req.body.nibol_token, req.user)
    .then(() => {
      res.send({ success: true })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred."
      })
    })
};


exports.retireveNibolTokenFromPassword = (req, res) => {

  loginInfo = {
    email: req.user,
    method: "password",
    token: req.body.password,
    keep: true
  }

  axios.post('https://api.nibol.co/v2/login/auth', loginInfo)
    .then(result => {
      saveNibolToken(result.data.token, req.user)
        .then(() => {
          res.send({ success: true })
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred."
          })
        })
    })
    .catch(err => {
      res.status(401).send({
        message:
          "Wrong Nibol Password."
      })
    });

}

async function saveNibolToken(token, mail) {

  try {

    res = await axios.get(`${process.env.NIBOL_URL}/company/info`, { headers: { 'Authorization': 'Bearer ' + token } })
    if (res.status == 200) {
      await User.update(
        {
          nibol_token: token,
          nibol_id: await userHelper({ headers: { 'Authorization': 'Bearer ' + token } }, 'id')
        },
        { where: { email: mail } }
      )
    }

  } catch (e) {
    throw new Error('The token is not correct')
  }

}
