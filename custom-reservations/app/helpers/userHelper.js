const axios = require('axios');

module.exports = async function userHelper(headers, field) {
    try {
        var r = await axios.get('https://api.nibol.co/v2/app/business/user/profile', headers)
        if (field == 'id') return r.data.id
        else if (field == 'pic') return r.data.data.pic
    } catch (e) {
        throw new Error(e.message || 'Some error occurred.')
    }
}
