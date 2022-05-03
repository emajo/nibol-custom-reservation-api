const nibolAuthHeadersHelper = require("../helpers/nibolAuthHeadersHelper");
const userHelper = require("../helpers/userHelper");
const db = require("../models");
const User = db.users;
const authHelper = require('./../helpers/authHelper')

exports.login = (req, res) => {
  res.redirect(authHelper.buildRedirectUri())
};

exports.auth = (req, res) => {
  if (req?.query?.code) {
    authHelper.getToken(req.query.code)
      .then(token => {
        userInfo = authHelper.getUserInfo(token)
          .then(userInfo => {
            User.findOne({ where: { email: userInfo.email } })
              .then(queryRes => {
                var userExists = true
                if (!queryRes) {
                  User.create({
                    name: userInfo.name,
                    email: userInfo.email
                  })
                  userExists = false
                }
                res.redirect(`${process.env.APP_URL}/login?token=${authHelper.generateJwt(userInfo.email)}&exists=${userExists}`)
              })
              .catch(err => {
                res.status(500).send({
                  message:
                    err.message || "Some error occurred."
                });
              });
          })
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while getting the token."
        });
      });
  }
  else {
    res.redirect(process.env.URL + '/api/login')
  }
}

exports.update = (req, res) => {
  if (req.body.email) {
    req.body.email = undefined
  }
  User.update(req.body, {
    where: { email: req.user }
  })
    .then(() => {
      res.send({ success: true })
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating the User"
      })
    })
}

exports.get = (req, res) => {
  User.findOne({ attributes: ['name', 'role', 'default_desk', 'launch_slot'], where: { email: req.user }, raw: true })
    .then(async queryRes => {
      queryRes.pic = await userHelper(await nibolAuthHeadersHelper(req.user), 'pic')
      res.send(queryRes)
    })
}