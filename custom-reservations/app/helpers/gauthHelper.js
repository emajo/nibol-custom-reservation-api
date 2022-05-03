const axios = require('axios')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

exports.verify = async function (token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {email: payload['email'], name: payload['name']}

    // debugging
    // var r = await axios.get(`https://oauth2.googleapis.com/tokeninfo?${token}`)
    // return r.data.email
}