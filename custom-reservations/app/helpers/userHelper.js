const axios = require('axios');

module.exports = async function userHelper(headers, field) {
    try {
        if (field !== 'id' && field !== 'pic')
            throw new Error('"field" has to be id or pic')

        const { data } = await axios.get(`${process.env.NIBOL_URL}/user/profile`, headers)

        return field === 'id'
            ? data.id
            : data.data.pic
    } catch (e) {
        throw new Error(e.message || 'Some error occurred.')
    }
}
