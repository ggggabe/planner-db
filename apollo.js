const { ApolloServer, gql } = require('apollo-server')
require('dotenv').config()
const assert = require('assert')


const client = require('./db')

let db
client.connect(err => {
  assert.equal(err, null)
  console.log(err)
  db = client.db('planner-db')
})

const typeDefs = gql`
type Query {
  projects:[Project]
}

type Completion {
  message: String
  date: String
}

type Vertical {
  lead: String
  stack: [String]
  completions: [Completion]
}

type Project{
  _id: String
  name: String
  description: String
  design: Vertical
  development: Vertical
}
`

const resolvers = {
  Query: {
    projects: async () => {
      const values = await db.collection('projects').find().toArray().then(res => { return res })
      console.log({ values })
      return values
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen(4000).then(({ url }) => console.log(`Server running at ${url} `))