const { OIDCProvider } = require('../models/oidcProvider.repository')
const { Tenant } = require('../models/tenant.repository')
const { User } = require('../models/user.repository')

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
      clientId: '60d985bb7162615ea9cb71d7',
      clientSecret: '376e73ca3b19cccfd4cadfc993fe96a2',
      issuer: 'https://xnpnjb-demo.authing.cn/oidc',
      configurationEndpoint:
        'https://xnpnjb-demo.authing.cn/oidc/.well-known/openid-configuration',
      tenant: exampleTenant.id,
      callbackUrl: `http://localhost:5000/api/oidc/${exampleTenant.id}/callback`,
    },
  })

  console.log('>>>>>>>>>>示例数据初始化成功<<<<<<<<<<<<')
}

module.exports = {
  initExampleData,
}
