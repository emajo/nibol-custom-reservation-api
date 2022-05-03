const firebase = require('firebase-admin')
const serviceAccount = require('../config/serviceAccount.json')

firebase.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

module.exports = firebase