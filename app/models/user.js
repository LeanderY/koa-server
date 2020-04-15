const bcrypt = require('bcryptjs')
// 定义加密密码计算强度
const SALT_WORK_FACTOR = 10
const { Sequelize, Model } = require('sequelize')
const Auth = require('../../middlewares/auth')
const sequelize = require('../../core/db')

class User extends Model {
  static async getUserByEmail(email, password) {
    const user = await User.findOne({
      where: {
        email
      }
    })

    if (!user) {
      throw new global.errors.AuthFailed('用户名不存在')
    }

    const isMatch = bcrypt.compareSync(password, user.password)

    if (!isMatch) {
      throw new global.errors.AuthFailed('密码错误')
    }

    return Auth.generateToken(user.id, Auth.USER) // 用户 ID 以及权限
  }

  static async getUserByOpenid(openid) {
    return await User.findOne({
      where: {
        openid
      }
    })
  }

  static async registerByOpenid(openid) {
    return await User.create({
      openid
    })
  }
}

User.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    openid: {
      type: Sequelize.STRING(64),
      unique: true
    },
    nickname: Sequelize.STRING,
    email: {
      type: Sequelize.STRING(64),
      unique: true
    },
    // 观察者模式
    password: {
      type: Sequelize.STRING,
      set(val) {
        const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR)
        const password = bcrypt.hashSync(val, salt)
        this.setDataValue('password', password)
      }
    }
  },
  {
    sequelize,
    tableName: 'user'
  }
)

module.exports = User
