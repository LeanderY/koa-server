const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')

class BookComment extends Model {
    static async addComment(book_id, content) {
        // 查看是否存在相同评论
        const comment = await BookComment.findOne({
            where: {
                book_id,
                content
            }
        })
        if (!comment) {
            // 新增
            await BookComment.create({
                book_id,
                content,
                nums: 1
            })
        } else {
            // 数量 +1
            await comment.increment('nums', {
                by: 1
            })
        }
    }

    static async getComments(book_id) {
        return await BookComment.findAll({
            where: {
                book_id
            }
        })
    }

    // 只返回 ['content', 'nums']
    toJSON() {
        return {
            content: this.getDataValue('content'),
            nums: this.getDataValue('nums')
        }
    }
}

// 排除 ['book_id', 'id']
BookComment.prototype.exclude = ['book_id', 'id']

BookComment.init(
    {
        book_id: Sequelize.INTEGER,
        content: Sequelize.STRING(12),
        nums: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    },
    {
        sequelize,
        tableName: 'book_comment'
    }
)

module.exports = BookComment
