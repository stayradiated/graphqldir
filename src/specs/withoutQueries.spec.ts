import anyTest, { TestInterface } from 'ava'
import { makeExecutableSchema } from 'graphql-tools'
import { GraphQLList, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql'

import makeSchema from '../index'

const test = anyTest as TestInterface<{
  schema: any,
  executableSchema: any,
}>

test.beforeEach((t) => {
  const schema = makeSchema({ path: `${__dirname}/withoutQueries` })
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

test('schema.resolvers - should return an object', (t) => {
  const { schema } = t.context
  t.is(typeof schema.resolvers, 'object')
})

test('schema.resolvers - should return an Query key', (t) => {
  const { schema } = t.context
  t.falsy(schema.resolvers.Query)
})

test('schema.resolvers - should return an Mutation key', (t) => {
  const { schema } = t.context
  t.truthy(schema.resolvers.Mutation)
})

test('schema.resolvers - should return an Author key', (t) => {
  const { schema } = t.context
  t.truthy(schema.resolvers.Author)
})

test('schema.resolvers - Author should have posts key and should be a function', (t) => {
  const { schema } = t.context
  t.truthy(schema.resolvers.Author.posts)
  t.is(typeof schema.resolvers.Author.posts, 'function')
})

test('schema.resolvers - should return an Post key', (t) => {
  const { schema } = t.context
  t.truthy(schema.resolvers.Author)
})

test('schema.resolvers - Post should have author key and should be a function', (t) => {
  const { schema } = t.context
  t.truthy(schema.resolvers.Post.author)
  t.is(typeof schema.resolvers.Post.author, 'function')
})

test('executableSchema - should return a graphql schema', (t) => {
  const { executableSchema } = t.context
  t.truthy(executableSchema)
})

test('executableSchema - should NOT return a posts root query type', (t) => {
  const { executableSchema } = t.context
  const query = executableSchema.getTypeMap().Query
  t.falsy(query)
})

test('executableSchema - should return a author root query type', (t) => {
  const { executableSchema } = t.context
  const query = executableSchema.getTypeMap().Query
  t.falsy(query)
})

test('executableSchema - should return a upvotePost mutation type', (t) => {
  const { executableSchema } = t.context
  const query = executableSchema.getTypeMap().Mutation
  t.truthy(query)
})

test('executableSchema - should have a Author type', (t) => {
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

test('executableSchema - should have a Post type', (t) => {
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
