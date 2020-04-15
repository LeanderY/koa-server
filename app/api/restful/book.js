const Router = require('koa-router')
const Auth = require('../../../middlewares/auth')
const DoubanBook = require('@models/douban-book')
const Favor = require('@models/favor')
const BookComment = require('@models/book-comment')
const {
    PositiveIntegerValidator,
    SearchValidator,
    AddShortCommentValidator
} = require('@validator')
const router = new Router({
    prefix: '/v1/book'
})

// 获取热门书籍列表
router.get('/hot_list', new Auth().m, async ctx => {
    const books = await DoubanBook.getAll()
    ctx.body = books
})

// 获取书籍详情
router.get('/:id/detail', new Auth().m, async ctx => {
    const v = await new PositiveIntegerValidator().validate(ctx)
    ctx.body = await DoubanBook.detail(v.get('path.id'))
})

// 搜索书籍
router.get('/search', new Auth().m, async ctx => {
    const v = await new SearchValidator().validate(ctx)
    const result = await DoubanBook.search(
        v.get('query.key'),
        v.get('query.page'),
        v.get('query.count')
    )
    ctx.body = result
})

// 获取我喜欢书籍的数量
router.get('/favor/count', new Auth().m, async ctx => {
    const count = await Favor.getMyFavorBookCount(ctx.auth.uid)
    ctx.body = {
        count
    }
})

// 获取书籍点赞情况
router.get('/:book_id/favor', new Auth().m, async ctx => {
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'book_id'
    })
    ctx.body = await Favor.getBookFavor(ctx.auth.uid, v.get('path.book_id'))
})

// 新增短评
router.post('/add/short_comment', new Auth().m, async ctx => {
    const v = await new AddShortCommentValidator().validate(ctx, {
        id: 'book_id'
    })
    BookComment.addComment(v.get('body.book_id'), v.get('body.content'))

    throw new global.errors.Success()
})

// 获取书籍短评
router.get('/:book_id/short_comment', new Auth().m, async ctx => {
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'book_id'
    })
    const book_id = v.get('path.book_id')
    const comments = await BookComment.getComments(book_id)
    ctx.body = {
        comments,
        book_id
    }
})

module.exports = router
