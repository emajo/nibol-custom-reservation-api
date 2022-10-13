const users = require("../services/database");

module.exports = class User {
    constructor() {
        this.email = 'aaaaaaaaa'
    }

    async save() {
        users.doc(this.id).withConverter(userConverter).set(this)
    }
}

const userConverter = {
    toFirestore(user) {
        return {
            mail: user.email
        }
    }
}