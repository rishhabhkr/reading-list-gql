const graphql = require("graphql");
const _ = require("lodash");
const Book = require("../models/book");
const Author = require("../models/author")

const books = [
  {
    name: "Sapiens",
    genre: "Informative",
    id: "1",
    authorId: "2",
  },
  {
    name: "The Final Earth",
    genre: "Fantasy",
    id: "2",
    authorId: "1",
  },
  {
    name: "Harry Potter",
    genre: "Fantasy",
    id: "3",
    authorId: "3",
  },
  {
    name: "Autobiography of a Yogi",
    genre: "Spiritual",
    id: "4",
    authorId: "3",
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
  GraphQLList, //list of items or a specific type/ object Type
} = graphql;

const BookType = new GraphQLObjectType({
  name: "Book", //name of object
  fields: () => ({
    //fields that exist on Book, it is a function since all the types can have references to each other correctly.
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    //Type relations(Booktype relation with authorType), book can have an author of authorType object, resolver is resposible for populating the field
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return _.find(authors, { id: parent.authorId });
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType), //One author could've written many books thus keeping as gql list of BookType
      resolve(parent, args) {
        return _.filter(books, { authorId: parent.id });
      },
    },
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
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors;
      }
    }
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields:{
    addAuthor:{
      type: AuthorType,
      args: {
        name: {type: GraphQLString},      //Input to be provided with the mutation
        age: {type:GraphQLInt}
      },
      resolve(parent,args){
        let author= new Author({        //author is an instance of Author model
          name: args.name,
          age: args.age
        })
        return author.save();       //mongoose provides save(), saves the data in the collection.
      }
    },
    addBook: {
      type: BookType,
      args:{
        name:{type:GraphQLString},
        genre:{type: GraphQLString},
        authorId:{type: GraphQLID}
      },
      resolve(parent, args){
        let book= new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        })
        return book.save()
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
