const firebase = require('firebase-admin')
const serviceAccount = require('../config/serviceAccount.json')

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://custom-reservations-default-rtdb.europe-west1.firebasedatabase.app"
})

module.exports = firebase