const db = require("../models");
const User = db.users;

module.exports = async function nibolAuthHeadersHelper(mail) {
    try {
        token = await User.findOne({ attributes: ['nibol_token'], where: { email: mail } })

        return {
            headers: {
                'Authorization': 'Bearer ' + token.nibol_token
            }
        }
    }
    catch (e) {
        throw new Error('Nibol token not found')
    }
}
