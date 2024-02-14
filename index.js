var express = require('express');
var { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
var app = express();
const schema = require('./schema');
const resolvers = require('./resolvers');
const { makeExecutableSchema } = require('graphql-tools');

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolvers
});



mongoose.connect('mongodb+srv://diego:dvD48hSyLDBEsNxX@cluster0.ma52oy9.mongodb.net/comp3133_assigment1', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(success => {
  console.log(`MongoDB connected ${success}`)
}).catch(err => {
  console.log(`Error while MongoDB connection ${err}`)
});

app.use(express.json());

app.use('/graphql', graphqlHTTP({
    schema: executableSchema,
    graphiql: true,
}));


app.listen(4000, () => {
    console.log('Running a GraphQL API server at localhost:4000/graphql');
});
