import { readdirSync, existsSync } from 'fs'

/**
 * @hidden
 */

export interface Directory {
  resolvers?: Record<string, Function>,
  queries?: Record<string, Function>,
  mutations?: Record<string, Function>,
  subscriptions?: Record<string, Function>,
  type?: string,
  typeQuery?: string,
  typeMutation?: string,
  typeSubscription?: string,
}

/**
 * @hidden
 */

const buildDirectory = (path: string): Directory => {
  const {
    resolvers,
    queries,
    mutations,
    subscriptions,

    type,
    typeQuery,
    typeMutation,
    typeSubscription,
    ...otherProps
  } = require(path)

  const otherPropKeys = Object.keys(otherProps)
  if (otherPropKeys.length > 0) {
    console.warn(
      `Unexpected properties exported from ${path}: ${otherPropKeys.join(
        ', ',
      )}`,
    )
  }

  return {
    resolvers,
    queries,
    mutations,
    subscriptions,

    type: type != null ? type.trim() : undefined,
    typeQuery: typeQuery != null ? typeQuery.trim() : undefined,
    typeMutation: typeMutation != null ? typeMutation.trim() : undefined,
    typeSubscription:
      typeSubscription != null ? typeSubscription.trim() : undefined,
  }
}

/**
 * @hidden
 */

const readdir = (path: string, extensions: string[]): Directory[] => {
  const directories = [] as Directory[]

  readdirSync(path).forEach((dir) => {
    for (const extension of extensions) {
      const dirIndexPath = `${path}/${dir}/index${extension}`
      if (existsSync(dirIndexPath)) {
        directories.push(buildDirectory(dirIndexPath))
        break
      }
    }
  })

  return directories
}

export default readdir
