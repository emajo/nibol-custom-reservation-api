const nibolAuthHeadersHelper = require("../helpers/nibolAuthHeadersHelper");
const userHelper = require("../helpers/userHelper");
const db = require("../models"); 
const us = require('../models/user.model')

exports.get = (req, res) => {
  User.findOne({ attributes: ['name', 'role', 'default_desk', 'launch_slot'], where: { email: req.user }, raw: true })
    .then(async queryRes => {
      queryRes.pic = await userHelper(await nibolAuthHeadersHelper(req.user), 'pic')
      res.send(queryRes)
    })
}

exports.test = (req, res) => {
  var user = new us()
  user.save()
}