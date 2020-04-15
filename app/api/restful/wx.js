const axios = require('axios')
const util = require('util')
const User = require('@models/user')
const Auth = require('../../../middlewares/auth')

class WXManger {
  static async codeToToken(code) {
    const url = util.format(
      global.config.wx.loginUrl,
      global.config.wx.AppID,
      global.config.wx.AppSecret,
      code
    )

    const result = await axios.get(url)

    if (result.status !== 200) {
      throw new global.errors.AuthFailed('openid 获取失败')
    }

    const { errcode, errmsg } = result.data
    if (errcode) {
      throw new global.errors.AuthFailed('openid 获取失败:' + errmsg)
    }

    const { openid } = result.data

    let user = await User.getUserByOpenid(openid)
    if (!user) {
      user = await User.registerByOpenid(openid)
    }

    return Auth.generateToken(user.id, Auth.USER)
  }
}

module.exports = WXManger
