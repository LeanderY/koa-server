const { HttpException } = require('../core/http-exception')

// 洋葱模型的外层
const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    const isHttpException = error instanceof HttpException
    const isDev = global.config.env === 'dev'

    // throw 开发环境 不是HttpException
    if (isDev && !isHttpException) {
      throw error
    }

    if (isHttpException) {
      ctx.status = error.code
      ctx.body = {
        message: error.message,
        errorCode: error.errorCode,
        request: `${ctx.method} ${ctx.path}`
      }
    } else {
      // 未知型的错误处理
      ctx.status = 500
      ctx.body = {
        msg: 'we made a mistake O(∩_∩)O~~',
        errorCode: 999,
        request: `${ctx.method} ${ctx.path}`
      }
    }
  }
}

module.exports = catchError
