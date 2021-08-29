const { DataTypes } = require('sequelize')
const { sequelize } = require('./getConnection')

//  存储用户信息
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '用户名',
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '密码（本示例明文存储，实际业务场景需要加密）',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '邮箱（本示例认为邮箱是全局唯一的）',
    unique: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '用户头像',
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '用户性别（F：女，M：男）',
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '用户手机号',
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    comment: '是否是企业管理员',
    defaultValue: false,
  },
  tenant: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '所属企业',
  },
})

User.sync({
  alter: true,
})

class UserService {
  constructor() {}
  async insert(userInfo) {
    return await User.create(userInfo)
  }
  async findByEmail(email) {
    return await User.findOne({
      where: {
        email,
      },
    })
  }
}

module.exports = {
  User,
  userService: new UserService(),
}
