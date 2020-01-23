import anyTest, { TestInterface } from 'ava'
import { makeExecutableSchema } from 'graphql-tools'
import { GraphQLList, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql'

import makeSchema from '../index'

const test = anyTest as TestInterface<{
  schema: any,
  executableSchema: any,
}>

test.beforeEach((t) => {
  const schema = makeSchema({ path: `${__dirname}/withoutMutations` })
  const executableSchema = makeExecutableSchema(schema)

  t.context = {
    schema,
    executableSchema,
  }
})

test('schema.typeDefs - should return a string', (t) => {
  const { schema } = t.context
  t.is(typeof schema.typeDefs, 'string')
})

test('should return an object', (t) => {
  const { schema } = t.context
  t.is(typeof schema.resolvers, 'object')
})

test('should return an Query key', (t) => {
  const { schema } = t.context
  t.truthy(schema.resolvers.Query)
})

test('Query should have posts and author keys and they should both be functions', (t) => {
  const { schema } = t.context
  t.truthy(schema.resolvers.Query.posts)
  t.truthy(schema.resolvers.Query.author)
  t.is(typeof schema.resolvers.Query.posts, 'function')
  t.is(typeof schema.resolvers.Query.author, 'function')
})

test('should return an Mutation key', (t) => {
  const { schema } = t.context
  t.falsy(schema.resolvers.Mutation)
})

test('should return an Author key', (t) => {
  const { schema } = t.context
  t.truthy(schema.resolvers.Author)
})

test('Author should have posts key and should be a function', (t) => {
  const { schema } = t.context
  t.truthy(schema.resolvers.Author.posts)
  t.is(typeof schema.resolvers.Author.posts, 'function')
})

test('should return an Post key', (t) => {
  const { schema } = t.context
  t.truthy(schema.resolvers.Author)
})

test('Post should have author key and should be a function', (t) => {
  const { schema } = t.context
  t.truthy(schema.resolvers.Post.author)
  t.is(typeof schema.resolvers.Post.author, 'function')
})

test('should return a graphql schema', (t) => {
  const { executableSchema } = t.context
  t.truthy(executableSchema)
})

test('schema should return a posts root query type', (t) => {
  const { executableSchema } = t.context
  const query = executableSchema.getTypeMap().Query.getFields().posts
  t.truthy(query)
  const post = executableSchema.getTypeMap().Post
  t.deepEqual(query.type, new GraphQLList(post))
})

test('schema should return a author root query type', (t) => {
  const { executableSchema } = t.context
  const query = executableSchema.getTypeMap().Query.getFields().author
  t.truthy(query)
  const author = executableSchema.getTypeMap().Author
  t.is(query.type, author)
  t.is(query.args[0].name, 'id')
  t.deepEqual(query.args[0].type, new GraphQLNonNull(GraphQLInt))
})

test('schema should NOT return a upvotePost mutation type', (t) => {
  const { executableSchema } = t.context
  const query = executableSchema.getTypeMap().Mutation
  t.falsy(query)
})

test('should have a Author type', (t) => {
  const { executableSchema } = t.context

  const type = executableSchema.getTypeMap().Author
  t.truthy(type)

  const fields = type.getFields()
  t.truthy(fields.id)
  t.truthy(fields.firstName)
  t.truthy(fields.lastName)
  t.truthy(fields.posts)

  t.deepEqual(fields.id.type, new GraphQLNonNull(GraphQLInt))
  t.is(fields.firstName.type, GraphQLString)
  t.is(fields.lastName.type, GraphQLString)

  const post = executableSchema.getTypeMap().Post
  t.deepEqual(fields.posts.type, new GraphQLList(post))
})

test('should have a Post type', (t) => {
  const { executableSchema } = t.context

  const type = executableSchema.getTypeMap().Post
  t.truthy(type)

  const fields = type.getFields()
  t.truthy(fields.id)
  t.truthy(fields.title)
  t.truthy(fields.author)
  t.truthy(fields.votes)

  t.deepEqual(fields.id.type, new GraphQLNonNull(GraphQLInt))
  t.is(fields.title.type, GraphQLString)

  const author = executableSchema.getTypeMap().Author
  t.is(fields.author.type, author)
  t.is(fields.votes.type, GraphQLInt)
})
