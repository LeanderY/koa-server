const Koa = require('koa')
const static = require('koa-static')
const path = require('path')
const bodyParser = require('koa-bodyparser')
require('module-alias/register')
const InitManager = require('./core/init')
//路由实例
const catchError = require('./middlewares/exception')

const app = new Koa()

app.use(bodyParser())

app.use(catchError)

// 静态资源目录
app.use(static(path.join(__dirname, './static')))

// Router
InitManager.initCore(app)

app.listen(3000, () => {
    console.log(`🚀 Server ready at http://localhost:3000`)
})
