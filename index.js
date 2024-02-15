const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const {typeDefs} = require('./schema');
const {resolvers} = require('./resolvers');
const {makeExecutableSchema} = require('graphql-tools');

const executableschema = makeExecutableSchema({
  typeDefs,
  resolvers
});


const app = express();


mongoose.connect('mongodb+srv://diego:dvD48hSyLDBEsNxX@cluster0.ma52oy9.mongodb.net/comp3133_assigment1', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('Error while MongoDB connection', err);
});

app.use(express.json());

const server = new ApolloServer({
  schema: executableschema,
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;

  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  );
}

startServer();
