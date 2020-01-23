import { Directory } from './readdir'

/**
 * @hidden
 */

const buildTypeDefs = (directories: Directory[]) => {
  const typeDefs = []
  const queryDefs = []
  const mutationDefs = []
  const subscriptionDefs = []
  const schemaDefs = []

  for (const item of directories) {
    if (item.type != null) {
      typeDefs.push(item.type)
    }
    if (item.typeQuery != null) {
      queryDefs.push(item.typeQuery)
    }
    if (item.typeMutation != null) {
      mutationDefs.push(item.typeMutation)
    }
    if (item.typeSubscription != null) {
      subscriptionDefs.push(item.typeSubscription)
    }
  }

  if (queryDefs.length > 0) {
    typeDefs.push(`# the schema allows the following queries:
type Query {
  ${queryDefs.join('\n  ')}
}`)
    schemaDefs.push('query: Query')
  }
  if (mutationDefs.length > 0) {
    typeDefs.push(`# the schema allows the following mutations:
type Mutation {
  ${mutationDefs.join('\n  ')}
}`)
    schemaDefs.push('mutation: Mutation')
  }
  if (subscriptionDefs.length > 0) {
    typeDefs.push(`# the schema allows the following subscriptions:
type Subscription {
  ${subscriptionDefs.join('\n  ')}
}`)
    schemaDefs.push('subscription: Subscription')
  }

  typeDefs.push(`schema {
  ${schemaDefs.join('\n  ')}
}`)

  return typeDefs.join('\n')
}

export default buildTypeDefs
