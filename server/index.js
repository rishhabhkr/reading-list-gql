const express = require('express')
const { graphqlHTTP } = require('express-graphql')  //create an express server that runs a graphql API
const schema = require('./schema/schema')
const mongoose = require("mongoose")

const app = express()

//Connect to the monogoDB database
mongoose.connect('mongodb+srv://rishabh:test123@gql-reading-list.wrge3f7.mongodb.net/?retryWrites=true&w=majority');
mongoose.connection.once('open', ()=>{
  console.log("Connected to database");
})

app.use(
  '/graphql',
  graphqlHTTP({         //graphql Middleware takes input like schema, graphiql
    schema,
    graphiql: true,
  })
)

app.listen(4000, () => {
  console.log('server running at 4000')
})
