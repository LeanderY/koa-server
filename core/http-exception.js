class HttpException extends Error {
  constructor(message = '服务器异常', errorCode = 10000, code = 400) {
    super()
    this.code = code
    this.message = message
    this.errorCode = errorCode
  }
}

class ParameterException extends HttpException {
  constructor(message, errorCode) {
    super()
    this.code = 400
    this.message = message || '参数错误'
    this.errorCode = errorCode || 10000
  }
}

class Success extends HttpException {
  constructor(message, errorCode) {
    super()
    this.code = 201
    this.message = message || 'ok'
    this.errorCode = errorCode || 0
  }
}

class NotFound extends HttpException {
  constructor(message, errorCode) {
    super()
    this.message = message || '资源未找到'
    this.errorCode = errorCode || 10000
    this.code = 404
  }
}

class AuthFailed extends HttpException {
  constructor(message, errorCode) {
    super()
    this.message = message || '授权失败'
    this.errorCode = errorCode || 10004
    this.code = 401
  }
}

class Forbbiden extends HttpException {
  constructor(message, errorCode) {
    super()
    this.message = message || '禁止访问'
    this.errorCode = errorCode || 10006
    this.code = 403
  }
}

class LikeError extends HttpException {
  constructor(message, errorCode) {
    super()
    this.code = 400
    this.message = '你已经点赞过'
    this.errorCode = 60001
  }
}

class DislikeError extends HttpException {
  constructor(message, errorCode) {
    super()
    this.code = 400
    this.message = '你已取消点赞'
    this.errorCode = 60002
  }
}

module.exports = {
  HttpException,
  ParameterException,
  Success,
  NotFound,
  AuthFailed,
  Forbbiden,
  LikeError,
  DislikeError
}
