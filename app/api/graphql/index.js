const Router = require('koa-router')
const graphqlHTTP = require('koa-graphql')
const { GraphQLObjectType, GraphQLSchema } = require('graphql')
const controllers = require('require-all')({
  dirname: __dirname + '/schema'
})
//
const fields = {}

Object.keys(controllers).forEach((schema) => {
  const object = controllers[schema]
  for (const key in object) {
    fields[key] = object[key]
  }
})

const router = new Router({
  prefix: '/v1'
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'queries',
    fields
  })
})

router.all(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
)

module.exports = router
