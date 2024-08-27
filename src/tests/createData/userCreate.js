const User = require('../../models/User')

const userCreate = async() => {
  const user = {
    firstName: 'Juan',
    lastName: 'Yidi',
    email: 'juan@gmail.com',
    password: 'juan123',
    phone: '+51912345678'
  }
  await User.create(user)
}

module.exports = userCreate