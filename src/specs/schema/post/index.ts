import { Post } from '../types'
import { authors, posts } from '../data'

export const queries = {
  posts: () => posts,
}

interface UpvotePostArgs {
  postId: number,
}

export const mutations = {
  upvotePost: (_: void, args: UpvotePostArgs) => {
    const { postId } = args
    const post = posts.find((post) => post.id === postId)
    if (!post) {
      throw new Error(`Couldn't find post with id ${postId}`)
    }
    post.votes += 1
    return post
  },
}

export const resolvers = {
  Post: {
    author: (post: Post) =>
      authors.find((author) => author.id === post.authorId),
  },
}

export const subscriptions = {
  postAdded: async function * () {
    while (true) {
      yield {
        id: 1,
        authorId: 1,
        title: 'Introduction to GraphQL',
        votes: 2,
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  },
}

export const type = `
  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }
`

export const typeQuery = `
  posts: [Post]
`

export const typeMutation = `
  upvotePost(postId: Int!): Post
`

export const typeSubscription = `
  postAdded: Post
`
