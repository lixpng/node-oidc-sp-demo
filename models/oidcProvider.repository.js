const { DataTypes } = require('sequelize')
const { sequelize } = require('./getConnection')

// 存储 OIDC 配置信息
const OIDCProvider = sequelize.define('OIDCProvider', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'OIDC 登录方式名称',
  },
  clientId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'OIDC IdP Client ID',
  },
  clientSecret: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'OIDC IdP Client Secret',
  },
  issuer: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'OIDC IdP issuer',
  },
  callbackUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '登录回调 URL',
  },
  configurationEndpoint: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'OIDC 配置信息端点',
  },
  tenant: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '所属租户 ID',
  },
})

OIDCProvider.sync({ alter: true })

class OIDCProviderService {
  constructor() {}
  async insert(providerInfo) {
    return await OIDCProvider.create(providerInfo)
  }
  async listAll() {
    return await OIDCProvider.findAll()
  }
  async listByTenant(tenantId) {
    return await OIDCProvider.findAll({
      where: {
        tenant: tenantId,
      },
    })
  }
  async findById(id) {
    return await OIDCProvider.findOne({
      where: {
        id,
      },
    })
  }
}

module.exports = {
  OIDCProvider,
  oidcProviderService: new OIDCProviderService(),
}
