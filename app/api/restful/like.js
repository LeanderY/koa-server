const Router = require('koa-router')
const Auth = require('../../../middlewares/auth')
const { LikeValidator } = require('@validator')
const Favor = require('@models/favor')
const router = new Router({ prefix: '/v1/like' })

// 点赞
router.post('/', new Auth().m, async ctx => {
  const v = await new LikeValidator().validate(ctx, {
    id: 'art_id'
  })

  // 传入的参数值就是 数字100
  await Favor.like(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)

  // success
  throw new global.errors.Success()
})

// 取消点赞
router.post('/cancel', new Auth().m, async ctx => {
  const v = await new LikeValidator().validate(ctx, {
    id: 'art_id'
  })
  await Favor.dislike(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)

  // success
  throw new global.errors.Success()
})

module.exports = router
