const { Op } = require('sequelize')
const { flatten } = require('lodash')
const { Movie, Sentence, Music } = require('./classic')
const { MOVIE, MUSIC, SENTENCE } = require('../lib/enum').ArtType

class Art {
    constructor(art_id, type) {
        this.art_id = art_id
        this.type = parseInt(type)
    }

    // 获取某一期期刊点赞状态和喜欢的人数
    async getDetail(uid) {
        const Favor = require('./favor')
        const art = await new Art(this.art_id, this.type).getData()
        if (!art) {
            throw new global.errors.NotFound()
        }

        const likeStatus = await Favor.isUserLikeIt(this.art_id, this.type, uid)

        return {
            art,
            like_status: likeStatus
        }
    }

    // 获取某一期期刊
    async getData() {
        let art = null
        const where = {
            where: {
                id: this.art_id
            }
        }
        switch (this.type) {
            case MOVIE:
                art = await Movie.findOne(where)
                break
            case MUSIC:
                art = await Music.findOne(where)
                break
            case SENTENCE:
                art = await Sentence.findOne(where)
                break
            default:
                break
        }
        return art
    }

    static async getList(artInfoObj) {
        const arts = []
        for (const key in artInfoObj) {
            // 判断数组是否为空
            const ids = artInfoObj[key]
            // 为空 跳过当前循环 执行下一次循环
            if (ids.length === 0) {
                continue
            }
            // 所有 Object 的 key 都是字符串 key 为字符串需要转型
            arts.push(await Art._getListByType(ids, parseInt(key)))
        }
        return flatten(arts)
    }

    static async _getListByType(ids, type) {
        let arts = null
        const where = {
            where: {
                id: {
                    [Op.in]: ids  // in 查询
                }
            }
        }
        switch (type) {
            case MOVIE:
                arts = await Movie.findAll(where)
                break
            case MUSIC:
                arts = await Music.findAll(where)
                break
            case SENTENCE:
                arts = await Sentence.findAll(where)
                break
            default:
                break
        }
        return arts
    }
}

module.exports = Art
