import readdir from './readdir'
import buildTypeDefs from './build-type-defs'
import buildResolvers from './build-resolvers'

interface MakeSchemaOptions {
  path: string,
  extensions?: string[],
}

const DEFAULT_EXTENSIONS = ['.js', '.ts']

const makeSchema = (options: MakeSchemaOptions) => {
  const { path, extensions = DEFAULT_EXTENSIONS } = options

  const items = readdir(path, extensions)

  return {
    typeDefs: buildTypeDefs(items),
    resolvers: buildResolvers(items),
  }
}

export default makeSchema
