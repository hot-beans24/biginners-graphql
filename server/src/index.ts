import { ApolloServer, gql } from 'apollo-server'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'

import JsonPlaceAPI, { type JsonPlaceAPIType } from './datasources'
import { users } from './data'

const prisma = new PrismaClient()

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    myPosts: [Post]
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    userId: ID!
  }

  type Query {
    hello(name: String!): String
    users: [User]
    user(id: ID!): User
    posts: [Post]
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: Int!, name: String!): User
    deleteUser(id: Int!): User
  }
`

const resolvers = {
  Query: {
    hello: (_: undefined, args: any) => {
      return `Hello ${args.name}`
    },
    users: () => {
      return prisma.user.findMany()
    },
    user: async (_: any, args: any, { dataSources }: any) => {
      return dataSources.JsonPlaceAPI.getUser(args.id)
    },
    posts: async (_: any, __: any, { dataSources }: any) => {
      return dataSources.JsonPlaceAPI.getPosts()
    }
  },
  User: {
    myPosts: async (parent: any, __: any, { dataSources }: any) => {
      const posts = await dataSources.JsonPlaceAPI.getPosts()
      return posts.filter((post: any) => post.userId == parent.id)
    }
  },
  Mutation: {
    createUser: (_: any, args: any) => {
      return prisma.user.create({
        data: {
          name: args.name,
          email: args.email
        }
      })
    },
    updateUser: (_: any, args: any) => {
      return prisma.user.update({
        where: {
          id: args.id
        },
        data: {
          name: args.name
        }
      })
    },
    deleteUser: (_:any, args: any) => {
      return prisma.user.delete({
        where: {
          id: args.id
        }
      })
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      JsonPlaceAPI: new JsonPlaceAPI()
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})