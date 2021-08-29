const { DataTypes } = require('sequelize')
const { sequelize } = require('./getConnection')

//  存储租户(企业)信息
const Tenant = sequelize.define('Tenant', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '公司名',
    unique: true,
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '公司 logo',
  },
})

Tenant.sync({ alter: true })

class TenantService {
  constructor() {}

  async insert(tenantInfo) {
    return await Tenant.create(tenantInfo)
  }
  async findById(id) {
    return await Tenant.findOne({
      where: {
        id,
      },
    })
  }
  async findByName(name) {
    return await Tenant.findOne({
      where: {
        name,
      },
    })
  }
}

module.exports = {
  Tenant,
  tenantService: new TenantService(),
}
