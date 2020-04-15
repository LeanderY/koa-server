const Router = require('koa-router')
const Auth = require('../../../middlewares/auth')
const Flow = require('@models/flow')
const Art = require('@models/art')
const Favor = require('@models/favor')
const { PositiveIntegerValidator, LikeValidator } = require('@validator')
const router = new Router({ prefix: '/v1/classic' })

// 获取最新期刊
router.get('/latest', new Auth().m, async ctx => {
    const flow = await Flow.findOne({
        order: [
            ['index', 'DESC']
        ]
    })

    ctx.body = await getClassicData(flow.art_id, flow.type, flow.index, ctx.auth.uid)
})

// 获取下一期
router.get('/:index/next', new Auth().m, async ctx => {
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'index'
    })

    const index = v.get('path.index')
    const flow = await Flow.findOne({
        where: {
            index: index + 1
        }
    })

    if (!flow) {
        throw new global.errors.NotFound()
    }

    ctx.body = await getClassicData(flow.art_id, flow.type, flow.index, ctx.auth.uid)
})

// 获取上一期
router.get('/:index/previous', new Auth().m, async ctx => {
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'index'
    })

    const index = v.get('path.index')
    const flow = await Flow.findOne({
        where: {
            index: index - 1
        }
    })

    if (!flow) {
        throw new global.errors.NotFound()
    }

    ctx.body = await getClassicData(flow.art_id, flow.type, flow.index, ctx.auth.uid)
})

// 获取期刊详情
router.get('/:type/:id', new Auth().m, async ctx => {
    const v = await new LikeValidator().validate(ctx)
    const id = v.get('path.id')
    const type = parseInt(v.get('path.type'))

    const { art, like_status } = await new Art(id, type).getDetail(ctx.auth.uid)
    art.setDataValue('like_status', like_status)

    ctx.body = art
})

// 获取期刊点赞情况
router.get('/:type/:id/favor', new Auth().m, async ctx => {
    const v = await new LikeValidator().validate(ctx)
    const id = v.get('path.id')
    // 通过 url 或者 params(?) 传入的是一个字符串
    // 必须指定 isInt 才会自动转型
    const type = parseInt(v.get('path.type'))

    const { art, like_status } = await new Art(id, type).getDetail(ctx.auth.uid)

    ctx.body = {
        fav_nums: art.fav_nums,
        like_status
    }
})

// 获取我喜欢的期刊
router.get('/favor', new Auth().m, async ctx => {
    const uid = ctx.auth.uid
    ctx.body = await Favor.getMyClassicFavors(uid)
})

async function getClassicData(art_id, type, index, uid) {
    // art 是一个 实体
    const art = await new Art(art_id, type).getData()
    // 获取用户点赞状态
    const likeStatus = await Favor.isUserLikeIt(art_id, type, uid)

    // 序列化 把对象转化为json 只有 dataValues 字段下面相关的数据才会作为json返回回去
    art.setDataValue('index', index)
    art.setDataValue('like_status', likeStatus)
    // art.exclude = ['index','like_status']
    return art
}

module.exports = router
