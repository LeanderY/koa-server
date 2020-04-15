const { Sequelize, Model, Op } = require('sequelize')
const sequelize = require('../../core/db')
const { MOVIE, MUSIC, SENTENCE, BOOK } = require('../lib/enum').ArtType

class Favor extends Model {
    // 1. favor 添加一条记录 2. 修改 classic fav_nums
    // 3. 自定义的方法不需要加 { transaction: t }
    static async like(art_id, type, uid) {
        const Art = require('./art')
        const favor = await Favor.findOne({
            where: {
                art_id,
                type,
                uid
            }
        })

        if (favor) {
            throw new global.errors.LikeError()
        }

        // 数据库事务
        return sequelize.transaction(async t => {
            await Favor.create(
                {
                    art_id,
                    type,
                    uid
                },
                { transaction: t }
            )
            const art = await new Art(art_id, type).getData()
            await art.increment('fav_nums',
                {
                    by: 1,
                    transaction: t
                }
            )
        })
    }

    static async dislike(art_id, type, uid) {
        const Art = require('./art')
        const favor = await Favor.findOne({
            where: {
                art_id,
                type,
                uid
            }
        })

        if (!favor) {
            throw new global.errors.DislikeError()
        }
        // Favor 类 没有被实例化 数据库角度来说代表的是数据库中的一个表
        // favor 表里面的一个记录
        return sequelize.transaction(async t => {
            await favor.destroy(
                {
                    force: true,
                    transaction: t
                }
            )
            const art = await new Art(art_id, type).getData()
            await art.decrement('fav_nums',
                {
                    by: 1,
                    transaction: t
                }
            )
        })
    }

    static async isUserLikeIt(art_id, type, uid) {
        const favor = await Favor.findOne({
            where: {
                art_id,
                type,
                uid
            }
        })

        return favor ? true : false
    }

    static async getMyFavorBookCount(uid) {
        return await Favor.count({
            where: {
                uid,
                type: BOOK
            }
        })
    }

    static async getBookFavor(uid, book_id) {
        const favorNums = await Favor.count({
            where: {
                art_id: book_id,
                type: BOOK
            }
        })

        const isFavor = await Favor.findOne({
            where: {
                art_id: book_id,
                uid,
                type: BOOK
            }
        })

        return {
            fav_nums: favorNums,
            like_status: isFavor ? 1 : 0
        }
    }

    static async getMyClassicFavors(uid) {
        const Art = require('./art')
        // arts 为数组
        const arts = await Favor.findAll({
            where: {
                uid,
                type: {
                    [Op.not]: BOOK
                }
            }
        })

        if (!arts) {
            throw new global.errors.NotFound()
        }

        const artInfoObj = {
            [MOVIE]: [],
            [MUSIC]: [],
            [SENTENCE]: []
        }

        // 对 Object 数组进行便利
        for (const artInfo of arts) {
            artInfoObj[artInfo.type].push(artInfo.art_id)
        }

        return await Art.getList(artInfoObj)
    }
}

Favor.init(
    {
        uid: {
            type: Sequelize.INTEGER
        },
        art_id: Sequelize.INTEGER,
        type: Sequelize.INTEGER
    },
    {
        sequelize,
        tableName: 'favor'
    }
)

module.exports = Favor
