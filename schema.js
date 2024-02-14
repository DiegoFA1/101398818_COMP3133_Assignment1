const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Employee {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    salary: Float!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
  }

  type Query {
    Login(username_email: String!, password: String!): User!
    getEmployees: [Employee]
    getEmployee(id: ID!): Employee!
    hello: String
  }

  type Mutation {

    signUp(username: String!,
        email: String!,
        password: String!): User!

    addEmployee(first_name: String!,
        last_name: String!,
        email: String!,
        gender: String!,
        salary: Float!): Employee!
    
    updateEmployee(id: ID!,
        first_name: String,
        last_name: String,
        email: String,
        gender: String,
        salary: Float): Employee
    
    deleteEmployee(id: ID!): Employee!
    
  }
`);

module.exports = schema;