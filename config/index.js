module.exports = {
  // 环境配置
  env: 'dev',
  database: {
    dbName: 'test-db',
    host: '129.211.31.67',
    port: 3306,
    user: 'admin',
    password: '2bCCc4jJzbZxrzXc'
  },
  // jwt
  security: {
    secretKey: 'jwt_secret',
    expiresIn: 60 * 60 * 24
  },
  wx: {
    AppID: 'wx8ecd8e97bce9d48b',
    AppSecret: '92254010351c088eddcd573544095d66',
    loginUrl:
      'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
  },
  host: 'http://localhost:3000/'
}
