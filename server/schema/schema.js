const graphql = require('graphql')
const _ = require('lodash')

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
} = graphql

const books = [
  {
    name: 'Sapiens',
    genre: 'Informative',
    id: '1',
  },
  {
    name: 'The Final Earth',
    genre: 'Fantasy',
    id: '2',
  },
  {
    name: 'Harry Potter',
    genre: 'Fantasy',
    id: '3',
  },
  {
    name: 'Autobiography of a Yogi',
    genre: 'Spiritual',
    id: '4',
  },
]

const authors = [
  {
    name: 'Yuval Noah Harari',
    age: 44,
    id: '1',
  },
  {
    name: 'Jk Rowling',
    age: 42,
    id: '2',
  },
  {
    name: 'Paramhansa Yogananda',
    age: 100,
    id: '3',
  },
]

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
  }),
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //code to get data from db/other source.
        return _.find(books, { id: args.id })
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id })
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
})
