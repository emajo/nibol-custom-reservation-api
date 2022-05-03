const firebase = require('../services/firebase')

module.exports = function validateAuthenticationToken(req, res, next) {
    const authToken = req.headers.authorization.split(' ')[1]

    if (!authToken) {
        return res.status(401).send({
            message: 'Auth token not set.'
        });
    }

    try {
        user = firebase.auth.verifyIdToken(authToken)
        
        if(!user){
            throw new Error('User not found')
        }

        req.user = user
        next()
    } catch(e) {
        return res.status(403).send({
            message: 'Invalid auth token.'
        });
    }

}