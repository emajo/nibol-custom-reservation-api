const axios = require('axios')
const jwt = require('jsonwebtoken')

var baseUrl = 'https://api-v2.fattureincloud.it'
var authorizePath = '/oauth/authorize'
var tokenPath = '/oauth/token'
var redirectUrl = process.env.URL + '/api/auth'
var clientId = process.env.FIC_CLIENT_ID
var scopes = 'settings:r'

exports.buildRedirectUri = function () {

    var params = {
        'response_type': 'code',
        'client_id': clientId,
        'redirect_uri': redirectUrl,
        'scope': scopes,
        'state': 'state'
    };

    var query = new URLSearchParams(params).toString()
    return baseUrl + authorizePath + '?' + query

}

exports.getToken = async function (code) {
    var params = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirectUrl,
        'client_id': clientId,
        'client_secret': process.env.FIC_CLIENT_SECRET
    };

    try {
        var result = await axios.post(baseUrl + tokenPath, params)
    }
    catch (err) {
        throw new Error("Error while getting the token")
    }

    return result.data.access_token
}

exports.getUserInfo = async function (token) {
    var params = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };

    var result = await axios.get(baseUrl + '/user/info', params)

    return {
        name: result.data.data.name,
        email: result.data.data.email
    }
}

exports.generateJwt = function (user) {
    return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1d' });
}