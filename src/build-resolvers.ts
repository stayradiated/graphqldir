import merge from 'deepmerge'

import { Directory } from './readdir'

export interface Resolvers {
  [key: string]: Record<string, any>,
  Query?: Record<string, any>,
  Mutation?: Record<string, any>,
  Subscription?: Record<string, any>,
}

/**
 * @hidden
 */

const buildResolvers = (directories: Directory[]) => {
  const rootResolvers = merge.all(
    directories.map((item) => item.resolvers).filter(Boolean),
  )
  const rootQuery = merge.all(
    directories.map((item) => item.queries).filter(Boolean),
  )
  const rootMutations = merge.all(
    directories.map((item) => item.mutations).filter(Boolean),
  )
  const rootSubscriptions = merge.all(
    directories.map((item) => item.subscriptions).filter(Boolean),
  )

  const resolvers: Resolvers = {
    ...rootResolvers,
  }

  if (Object.keys(rootQuery).length > 0) {
    resolvers.Query = rootQuery
  }

  if (Object.keys(rootMutations).length > 0) {
    resolvers.Mutation = rootMutations
  }

  if (Object.keys(rootSubscriptions).length > 0) {
    resolvers.Subscription = rootSubscriptions
  }

  return resolvers
}

export default buildResolvers
