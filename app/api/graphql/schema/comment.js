const {
    GraphQLInt,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
  } = require('graphql')
  
  const BookComment = require('@models/book-comment')
  
  const commentType = new GraphQLObjectType({
    name: 'commnet',
    fields: {
      id: {
        type: GraphQLInt
      },
      book_id: {
        type: GraphQLInt
      },
      content: {
        type: GraphQLString
      },
      nums: {
        type: GraphQLInt
      }
    }
  })
  
  /**
   * query {
   *   detail(id: 10){}
   * }
   */
  const addComment = {
    type: commentType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLInt)
      },
      content: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    async resolve(root, params) {
      return await BookComment.addComment(params.id, params.content)
    }
  }
  
  /**
   * query {
   *   addComment(id:150, content:"神马书籍"){}
   * }
   */
  const getComments = {
    type: GraphQLList(commentType),
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    },
    async resolve(root, params) {
      return await BookComment.getComments(params.id)
    }
  }
  
  module.exports = {
    addComment,
    getComments
  }
  