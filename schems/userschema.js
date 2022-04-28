const { model, Schema } = require('mongoose')

let userSchema = new Schema({
    login: {
        type: String
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
    lastname:  {
        type: String
    },
    avatar: {
        type: String,
        default: 'empty-avatar.jpg'
    }
})

let User = model('user', userSchema)

module.exports = User