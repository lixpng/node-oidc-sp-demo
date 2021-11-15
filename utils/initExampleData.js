const { OIDCProvider } = require('../models/oidcProvider.repository')
const { Tenant } = require('../models/tenant.repository')
const { User } = require('../models/user.repository')
const { baseUrl } = require('../utils/config')

async function initExampleData() {
  console.log('>>>>>>>>>>开始初始化示例数据<<<<<<<<<<<<')
  // 示例企业
  const [exampleTenant] = await Tenant.findOrCreate({
    where: {
      name: 'Authing',
    },
    defaults: {
      name: 'Authing',
      logo: 'https://files.authing.co/authing-console/login_logo.svg',
    },
  })

  // 示例用户，同时也是示例企业的管理员
  await User.findOrCreate({
    where: {
      email: 'admin@authing.cn',
    },
    defaults: {
      name: 'admin',
      password: 'admin',
      email: 'admin@authing.cn',
      avatar:
        'http://files.authing.co/authing-console/authing-console-logo.png',
      gender: 'M', // M 表示男
      phone: '12345678901',
      isAdmin: true,
      tenant: exampleTenant.id,
    },
  })

  // 示例 OIDC 配置
  await OIDCProvider.findOrCreate({
    where: {
      clientId: '60d985bb7162615ea9cb71d7',
    },
    defaults: {
      name: 'Demo',
      clientId: '613f1a51ce39b66d313f6871',
      clientSecret: 'b611cfaf27ff005b075c185831be56d9',
      issuer: 'https://ldmmbebkojmi-demo.authing.cn/oidc',
      configurationEndpoint:
        'https://ldmmbebkojmi-demo.authing.cn/oidc/.well-known/openid-configuration',
      tenant: exampleTenant.id,
      callbackUrl: `${baseUrl}/api/oidc/${exampleTenant.id}/callback`,
    },
  })

  console.log('>>>>>>>>>>示例数据初始化成功<<<<<<<<<<<<')
}

module.exports = {
  initExampleData,
}
