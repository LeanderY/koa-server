const {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql')

const DoubanBook = require('@models/douban-book')

const bookType = new GraphQLObjectType({
  name: 'book',
  fields: {
    id: {
      type: GraphQLInt
    },
    image: {
      type: GraphQLString
    },
    author: {
      type: GraphQLString
    },
    title: {
      type: GraphQLString
    },
    introduce: {
      type: GraphQLString
    },
    tags: {
      type: GraphQLString
    }
  }
})

/**
 * query {
 *   detail(id: 10){}
 * }
 */
const detial = {
  type: bookType,
  description:'书籍详情',
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  async resolve(root, params) {
    return await DoubanBook.detail(params.id)
  }
}

/**
 * query {
 *   all{}
 * }
 */
const all = {
  type: GraphQLList(bookType),
  description:'获取热门书籍',
  args: {},
  async resolve() {
    return await DoubanBook.getAll()
  }
}

/**
 * query{
 *   search(key:'刀行',page:1,count:5){}
 * }
 */
const search = {
  type: GraphQLList(bookType),
  description:'搜索',
  args: {
    key: {
      type: new GraphQLNonNull(GraphQLString)
    },
    page: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    count: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  async resolve(root, params) {
    const result = await DoubanBook.search(
      params.key,
      params.page,
      params.count
    )
    return result.rows
  }
}

module.exports = {
  all,
  detial,
  search
}
