const Router = require('koa-router')
const requireDirectory = require('require-directory')

class InitManager {
  static initCore(app) {
    InitManager.app = app
    InitManager.initLoadModules()
    InitManager.loadConfig()
    InitManager.loadHttpException()
  }

  // 装载所有子路由
  static initLoadModules() {
    // 需要以 module.exports = router 的形式导出路由模块!!!
    const PATH = `${process.cwd()}/app/api`
    requireDirectory(module, PATH, {
      visit: obj => {
        if (obj instanceof Router) {
          InitManager.app.use(obj.routes()).use(obj.allowedMethods())
        }
      }
    })
  }

  // 加载所有配置项
  static loadConfig() {
    const configPath = `${process.cwd()}/config`
    const config = require(configPath)
    global.config = config
  }

  // 加载全局错误配置项
  static loadHttpException() {
    const errors = require('./http-exception')
    global.errors = errors
  }
}

module.exports = InitManager
