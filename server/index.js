const express = require('express')
const { graphqlHTTP } = require('express-graphql')  //create an express server that runs a graphql API
const schema = require('./schema/schema')

const app = express()

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
