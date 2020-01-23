import readdir from './readdir'
import buildTypeDefs from './build-type-defs'
import buildResolvers from './build-resolvers'

interface MakeSchemaOptions {
  extensions?: string[],
}

const DEFAULT_EXTENSIONS = ['.js', '.ts']

const makeSchema = (
  paths: string | string[],
  options: MakeSchemaOptions = {},
) => {
  const { extensions = DEFAULT_EXTENSIONS } = options

  if (typeof paths === 'string') {
    paths = [paths]
  }

  const items = paths.map((path) => readdir(path, extensions)).flat()

  return {
    typeDefs: buildTypeDefs(items),
    resolvers: buildResolvers(items),
  }
}

export default makeSchema
