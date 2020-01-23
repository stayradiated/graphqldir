import { Author } from '../types'
import { authors, posts } from '../data'

interface QueryAuthorArgs {
  id: number,
}

const queries = {
  author: (_: void, args: QueryAuthorArgs) => {
    const { id } = args
    return authors.find((author) => author.id === id)
  },
}

const resolvers = {
  Author: {
    posts: (author: Author) =>
      posts.filter((_author) => {
        return _author.id === author.id
      }),
  },
}

const type = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post] # the list of Posts by this author
  }
`

const typeQuery = `
  author(id: Int!): Author
`

export { queries, resolvers, type, typeQuery }
