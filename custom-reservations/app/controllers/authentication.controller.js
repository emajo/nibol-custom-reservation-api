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
                if (queryRes) {
                  // queryRes.update(
                  //   //{auth_token: authHelper.generateJwt(queryRes.email)},
                  //   {where: {email: queryRes.email}}
                  // )
                  // .then(updatedRes => {
                  //   res.send(updatedRes)
                  // })
                }
                else {
                  User.create({
                    name: userInfo.name,
                    email: userInfo.email,
                    //auth_token: authHelper.generateJwt(userInfo.email)
                  })
                    .then(newUsr => {
                      res.send(authHelper.generateJwt(userInfo.email))
                    });
                }
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