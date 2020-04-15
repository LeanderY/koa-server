const { Sequelize, Model, Op } = require('sequelize')
const sequelize = require('../../core/db')
const Favor = require('./favor')

class DoubanBook extends Model {
  // 书籍详情
  static async detail(id) {
    return await DoubanBook.findOne({
      where: {
        id
      }
    })
  }
  
  // 查询分页
  static async search(key, page, count) {
    const offset = ( page - 1 ) * count
    return await DoubanBook.findAndCountAll({
      where: {
        // 模糊查询
        [Op.or]: [
          {
            author: { 
              [Op.like]: `%${key}%`
            }
          }, 
          {
            title: {
              [Op.like]: `%${key}%`
            }
          }
        ]
      },
      offset,
      limit: count
    })
  }

  static async getAll() {
    const books = await DoubanBook.findAll(
      {
        order: sequelize.random(),
        limit: 10
      }
    )

    const ids = []
    books.forEach(book => {
        ids.push(book.id)
    })

    const favors = await Favor.findAll({
        where: {
            art_id: {
              [Op.in]: ids
            },
            type: 400
        },
        group: ['art_id'],
        attributes: ['art_id',
          [
            Sequelize.fn('COUNT', '*'), 'count' // id 分组求和
          ]
        ]
    })

    books.forEach(book => {
      let count = 0
      favors.forEach(favor => {
          if (book.id === favor.art_id) {
            count = favor.get('count') // get 取值
          }
      })
      book.setDataValue('fav_nums', count)
    })

    return books
  }
}

DoubanBook.init(
  {
      image: Sequelize.STRING,
      author: Sequelize.STRING,
      title: Sequelize.STRING,
      introduce: Sequelize.STRING,
      tags: Sequelize.STRING
  },
  {
      sequelize,
      tableName: 'douban_book'
  }
)

module.exports = DoubanBook