const { Sequelize, Model } = require('sequelize')
const { unset, clone, isArray } = require('lodash')
const { dbName, host, port, user, password } = require('../config').database

// 数据库配置文件
const sequelize = new Sequelize(
    dbName,
    user,
    password,
    {
        dialect: 'mysql', // 指定数据库的类型 必须安装 MySQL 驱动
        host,
        port,
        logging: true,
        timezone: '+08:00', // 东八时区
        define: {
            timestamps: true, // 不需要 Sequelize 自动生成 createdAt 和 updatedAt 属性
            paranoid: true, // 启用了 paranoid（偏执）模式
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            underscored: true,
            freezeTableName: true,
            charset: 'utf8',
            dialectOptions: {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            }
        }
    }
)

// 如果我们启用了 paranoid（偏执）模式，destroy 的时候不会执行 DELETE 语句，而是执行一个 UPDATE 语句将 deletedAt 字段设置为当前时间（一开始此字段值为NULL）
// 不过需要注意的是，仅当 timestamps=true 为 true 时，paranoid 模式才能生效
// 当然我们也可以使用 user.destroy({force: true}) 来强制删除，从而执行 DELETE 语句进行物理删除

// 同步表结构
sequelize.sync({
    force: false // force 为 true 强制同步，先删除表，然后新建
})

Model.prototype.toJSON = function() {
    let data = clone(this.dataValues)
    unset(data, 'updated_at')
    unset(data, 'created_at')
    unset(data, 'deleted_at')

    if (isArray(this.exclude)) {
        this.exclude.forEach(value => {
            unset(data, value)
        })
    }

    // 格式化路径
    for (key in data) {
        if (key === 'image') {
            if (!data[key].startsWith('http')) data[key] = global.config.host + data[key]
        }
    }

    return data
}

module.exports = sequelize
