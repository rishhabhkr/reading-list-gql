const graphql = require("graphql");
const _ = require("lodash");

const books = [
  {
    name: "Sapiens",
    genre: "Informative",
    id: "1",
    authorId:"2"
  },
  {
    name: "The Final Earth",
    genre: "Fantasy",
    id: "2",
    authorId:"1"
  },
  {
    name: "Harry Potter",
    genre: "Fantasy",
    id: "3",
    authorId:"3"
  },
  {
    name: "Autobiography of a Yogi",
    genre: "Spiritual",
    id: "4",
    authorId:"3"
  },
];

const authors = [
  {
    name: "Yuval Noah Harari",
    age: 44,
    id: "1",
  },
  {
    name: "Jk Rowling",
    age: 42,
    id: "2",
  },
  {
    name: "Paramhansa Yogananda",
    age: 100,
    id: "3",
  },
];

const {
  GraphQLObjectType, //To create object types like Books and Authors etc.
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
} = graphql;

const BookType = new GraphQLObjectType({
  name: "Book", //name of object
  fields: () => ({
    //fields that exist on Book, it is a function since all the types can have references to each other correctly.
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    //Type relations, book can have an author of authorType object, resolver is resposible for populating the field
    author: {
            type: AuthorType,
            resolve(parent, args){
              console.log(parent)
            return _.find(authors, {id : parent.authorId})
            }}
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

const RootQuery = new GraphQLObjectType({
  //Query from where we can enter the schema or graph.
  name: "RootQueryType",
  fields: {
    //Fields have object that we can use as rootquery
    book: {
      //Accept three arguments; type, args(any argument to be used), resolve function.
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //Resolvers use can have 4 arguments, parents, args, context, info.
        //code to get data from db/other source.
        return _.find(books, { id: args.id });
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
