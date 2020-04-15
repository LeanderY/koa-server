const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')

// 接口权限验证中间层
class Auth {
  constructor(level) {
    this.level = level || 1
    Auth.USER = 8 // 普通用户
    Auth.ADMIN = 16 // 管理员
  }
  // 中间件 .m是一个属性不是方法所以不需要加括号
  get m() {
    return async (ctx, next) => {
      // ctx.req Koa 是建立在NodeJs基础上封装过后的一个框架 对Node原生的对象进行了一个封装
      // ctx.req 获取的是NodeJs 原生的 request 对象
      // ctx.request 获取的 Koa 对于NodeJs request 封装的 request
      const token = basicAuth(ctx.req)
      let errmsg = 'token不合法'
      if (!token) {
        throw new global.errors.Forbbiden()
      }

      // 验证合法性
      try {
        var decode = jwt.verify(token.name, global.config.security.secretKey)
      } catch (error) {
        // token 过期
        if (error.name === 'TokenExpiredError') {
          errmsg = 'token已过期'
          throw new global.errors.Forbbiden(errmsg)
        }
      }

      // 权限控制
      if (decode.scope < this.level) {
        errmsg = '接口权限不足'
        throw new global.errors.Forbbiden(errmsg)
      }

      // uid scope
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope
      }

      // 执行下一个中间件
      await next()
    }
  }

  // 验证 token
  static verifyToken(token) {
    try {
      const { secretKey } = global.config.security
      jwt.verify(token, secretKey)
      return true
    } catch (error) {
      return false
    }
  }

  // 生成Token
  static generateToken(uid, scope) {
    const { secretKey, expiresIn } = global.config.security
    const token = jwt.sign(
      {
        uid,
        scope
      },
      secretKey,
      {
        expiresIn
      }
    )
    return token
  }
}

module.exports = Auth
