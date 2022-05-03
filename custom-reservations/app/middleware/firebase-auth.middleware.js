const firebase = require('../services/firebase')

module.exports = async function validateAuthenticationToken(req, res, next) {
    const authToken = req.headers.authorization.split(' ')[1]

    if (!authToken) {
        return res.status(401).send({
            message: 'Auth token not set.'
        });
    }

    try {
        user = await firebase.auth().verifyIdToken(authToken)

        if(!user){
            throw new Error('User not found')
        }

        // Is it the first access? We need to save the user in the database.


        req.user = user
        next()
    } catch(e) {
        return res.status(403).send({
            message: 'Invalid auth token.'
        });
    }

}