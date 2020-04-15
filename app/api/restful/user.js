const Router = require('koa-router')
const { RegisterValidator, LoginValidator, NotEmptyValidator } = require('@validator')
const User = require('@models/user')
const { USER_EMAIL, USER_MINI_PROGRAM } = require('../../lib/enum').LoginType
const Auth = require('../../../middlewares/auth')
const WXManger = require('./wx')

const router = new Router(
  {
    prefix: '/v1/user'
  }
)

// 登录
router.post('/login', async ctx => {
  const v = await new LoginValidator().validate(ctx)
  const type = parseInt(v.get('body.type'))
  let token
  switch (type) {
    case USER_EMAIL:
      token = await User.getUserByEmail(v.get('body.account'), v.get('body.secret'))
      break
    case USER_MINI_PROGRAM: // 小程序登录
      token = await WXManger.codeToToken(v.get('body.account')) // code
      break
    default:
      break
  }
  ctx.body = {
    token
  }
})

// 邮箱类型的注册
router.post('/register', async ctx => {
  const v = await new RegisterValidator().validate(ctx)

  const user = {
    nickname: v.get('body.nickname'),
    email: v.get('body.email'),
    password: v.get('body.password2'),
  }
  // 创建新的用户
  await User.create(user)

  // success
  throw new global.errors.Success()
})

// 验证 Token
router.post('/verify', async ctx => {
  const v = await new NotEmptyValidator().validate(ctx)
  const result = Auth.verifyToken(v.get('body.token'))
  ctx.body = {
    is_valide: result
  }
})

module.exports = router
