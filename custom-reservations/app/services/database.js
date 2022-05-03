const { getFirestore } = require('firebase-admin/firestore');

const db = getFirestore()

if(process.env.FIRESTORE_EMULATOR_HOST) {
    console.log('Detected local environment, using Firestore local emulator')
}

const users = db.collection('users')